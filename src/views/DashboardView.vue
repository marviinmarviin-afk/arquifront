<script setup>
import { ref, onMounted } from 'vue';
import { http } from '../api/http.js';
import { cargarReferencia } from '../api/referencias.js';
import { formatearMoneda, formatearFecha, diasHasta } from '../api/formato.js';
import IconoSvg from '../components/IconoSvg.vue';
import GraficoLineas from '../components/GraficoLineas.vue';

const cargando = ref(true);

const tarjetas = ref([
  { clave: 'medicamentos', etiqueta: 'Medicamentos', icono: 'pastilla', total: 0, color: 'var(--acento)', fondo: 'var(--acento-suave)' },
  { clave: 'ventas', etiqueta: 'Ventas', icono: 'recibo', total: 0, serie: [], color: 'var(--azul)', fondo: 'var(--azul-suave)' },
  { clave: 'compras', etiqueta: 'Compras', icono: 'carrito', total: 0, serie: [], color: 'var(--acento)', fondo: 'var(--acento-suave)' },
  { clave: 'clientes', etiqueta: 'Clientes', icono: 'personas', total: 0, color: 'var(--azul)', fondo: 'var(--azul-suave)' },
]);

const bajoStock = ref([]);
const lotesPorVencer = ref([]);
const ventasRecientes = ref([]);
const mapaMedicamentos = ref({});
const mapaClientes = ref({});

// Ultimos n valores numericos de un arreglo de filas.
function ultimos(filas, campo, n = 12) {
  return filas.slice(-n).map((f) => Number(f[campo]) || 0);
}

// El backend solo soporta orden ascendente por id (ver BaseRepository),
// asi que la pagina 1 siempre trae los registros mas ANTIGUOS. Para que
// "recientes" signifique algo, si hay mas de una pagina se pide la
// ULTIMA (los ids mas altos = lo mas nuevo).
async function traerRecientes(ruta, limite = 100) {
  const primera = await http.listar(ruta, { pagina: 1, limite });
  if (!primera || (primera.paginas ?? 1) <= 1) return primera;
  return http.listar(ruta, { pagina: primera.paginas, limite });
}

async function cargar() {
  cargando.value = true;
  try {
    // Peticiones en paralelo (fetch nativo via el cliente http).
    const [med, ven, com, cli, lot] = await Promise.all([
      traerRecientes('medicamentos'),
      traerRecientes('ventas'),
      traerRecientes('compras'),
      http.listar('clientes', { pagina: 1, limite: 1 }),
      traerRecientes('lotes'),
    ]);

    tarjetas.value[0].total = med.total ?? 0;
    tarjetas.value[1].total = ven.total ?? 0;
    tarjetas.value[1].serie = ultimos(ven.datos, 'total_venta');
    tarjetas.value[2].total = com.total ?? 0;
    tarjetas.value[2].serie = ultimos(com.datos, 'total_compra');
    tarjetas.value[3].total = cli.total ?? 0;

    // Referencias para mostrar nombres.
    const [rmed, rcli] = await Promise.all([
      cargarReferencia('medicamentos'),
      cargarReferencia('clientes'),
    ]);
    mapaMedicamentos.value = rmed.mapa;
    mapaClientes.value = rcli.mapa;

    // Medicamentos con existencia baja (< 10).
    bajoStock.value = (med.datos || [])
      .filter((m) => Number(m.existencia_total_medicamento) < 10)
      .sort((a, b) => a.existencia_total_medicamento - b.existencia_total_medicamento)
      .slice(0, 6);

    // Lotes que vencen dentro de 60 dias (y no vencidos).
    lotesPorVencer.value = (lot.datos || [])
      .map((l) => ({ ...l, dias: diasHasta(l.fecha_vencimiento) }))
      .filter((l) => l.dias !== null && l.dias <= 60)
      .sort((a, b) => a.dias - b.dias)
      .slice(0, 6);

    // Ultimas ventas.
    ventasRecientes.value = (ven.datos || []).slice(-6).reverse();
  } catch {
    // Silencioso en el panel; las vistas individuales muestran el error.
  } finally {
    cargando.value = false;
  }
}

onMounted(cargar);
</script>

<template>
  <section class="panel-inicio aparece">
    <div class="bienvenida">
      <h2>Panel de control</h2>
      <p>Resumen del sistema de farmacia.</p>
    </div>

    <!-- Tarjetas de metricas -->
    <div class="tarjetas">
      <div v-for="t in tarjetas" :key="t.clave" class="metrica panel">
        <div class="metrica-top">
          <div class="metrica-icono" :style="{ color: t.color, background: t.fondo }">
            <IconoSvg :nombre="t.icono" :tamano="20" />
          </div>
          <span class="metrica-nombre">{{ t.etiqueta }}</span>
        </div>
        <div class="metrica-valor">{{ t.total.toLocaleString('es-GT') }}</div>
        <GraficoLineas v-if="t.serie && t.serie.length" :valores="t.serie" :color="t.color" />
        <div v-else class="metrica-pie">Total registrado</div>
      </div>
    </div>

    <!-- Paneles inferiores -->
    <div class="rejilla-inferior">
      <div class="panel bloque">
        <div class="bloque-cab">
          <h3><IconoSvg nombre="alerta" :tamano="18" /> Bajo stock</h3>
          <small>Existencia menor a 10</small>
        </div>
        <ul class="lista" v-if="bajoStock.length">
          <li v-for="m in bajoStock" :key="m.id_medicamento">
            <span class="nombre">{{ m.nombre_medicamento }}</span>
            <span class="insignia alerta">{{ m.existencia_total_medicamento }} u.</span>
          </li>
        </ul>
        <p v-else class="sin-datos">{{ cargando ? 'Cargando…' : 'Sin faltantes.' }}</p>
      </div>

      <div class="panel bloque">
        <div class="bloque-cab">
          <h3><IconoSvg nombre="reloj" :tamano="18" /> Lotes por vencer</h3>
          <small>Proximos 60 dias</small>
        </div>
        <ul class="lista" v-if="lotesPorVencer.length">
          <li v-for="l in lotesPorVencer" :key="l.id_lote">
            <span class="nombre">{{ mapaMedicamentos[l.id_medicamento] || ('Lote #' + l.id_lote) }}</span>
            <span class="insignia" :class="l.dias < 0 ? 'inactivo' : 'alerta'">
              {{ l.dias < 0 ? 'Vencido' : l.dias + ' dias' }}
            </span>
          </li>
        </ul>
        <p v-else class="sin-datos">{{ cargando ? 'Cargando…' : 'Nada por vencer.' }}</p>
      </div>

      <div class="panel bloque ancho">
        <div class="bloque-cab">
          <h3><IconoSvg nombre="recibo" :tamano="18" /> Ventas recientes</h3>
          <router-link to="/recurso/ventas" class="ver-todo">Ver todas</router-link>
        </div>
        <table class="mini-tabla" v-if="ventasRecientes.length">
          <thead>
            <tr><th>ID</th><th>Cliente</th><th>Fecha</th><th class="der">Total</th></tr>
          </thead>
          <tbody>
            <tr v-for="v in ventasRecientes" :key="v.id_venta">
              <td>#{{ v.id_venta }}</td>
              <td>{{ mapaClientes[v.id_cliente] || ('#' + v.id_cliente) }}</td>
              <td>{{ formatearFecha(v.fecha_venta) }}</td>
              <td class="der">{{ formatearMoneda(v.total_venta) }}</td>
            </tr>
          </tbody>
        </table>
        <p v-else class="sin-datos">{{ cargando ? 'Cargando…' : 'Aun no hay ventas.' }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.bienvenida h2 {
  margin: 0;
  font-size: 24px;
}
.bienvenida p {
  margin: 4px 0 22px;
  color: var(--texto-tenue);
}
.tarjetas {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
  margin-bottom: 22px;
}
.metrica {
  padding: 18px 18px 8px;
}
.metrica-top {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}
.metrica-icono {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: grid;
  place-items: center;
}
.metrica-nombre {
  font-size: 13px;
  font-weight: 600;
  color: var(--texto-tenue);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.metrica-valor {
  font-size: 30px;
  font-weight: 800;
  letter-spacing: -0.5px;
  margin-bottom: 8px;
}
.metrica-pie {
  font-size: 12px;
  color: var(--texto-tenue);
  padding-bottom: 12px;
}
.rejilla-inferior {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}
.bloque {
  padding: 18px 20px;
}
.bloque.ancho {
  grid-column: 1 / -1;
}
.bloque-cab {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}
.bloque-cab h3 {
  margin: 0;
  font-size: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.bloque-cab h3 :deep(svg) {
  color: var(--alerta);
}
.bloque-cab small {
  color: var(--texto-tenue);
  font-size: 12px;
}
.ver-todo {
  color: var(--acento);
  font-size: 13px;
  font-weight: 600;
}
.lista {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}
.lista li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 11px 0;
  border-bottom: 1px solid var(--borde);
}
.lista li:last-child {
  border-bottom: none;
}
.nombre {
  font-size: 14px;
}
.mini-tabla {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}
.mini-tabla th {
  text-align: left;
  padding: 8px 10px;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  color: var(--texto-tenue);
  border-bottom: 1px solid var(--borde);
}
.mini-tabla td {
  padding: 10px;
  border-bottom: 1px solid var(--borde);
}
.mini-tabla tr:last-child td {
  border-bottom: none;
}
.der {
  text-align: right;
}
.sin-datos {
  color: var(--texto-tenue);
  font-size: 14px;
  padding: 14px 0;
  margin: 0;
}
@media (max-width: 980px) {
  .tarjetas {
    grid-template-columns: 1fr 1fr;
  }
}
@media (max-width: 680px) {
  .tarjetas,
  .rejilla-inferior {
    grid-template-columns: 1fr;
  }
}
</style>
