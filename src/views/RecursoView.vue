<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { recursos } from '../api/recursos.js';
import { http } from '../api/http.js';
import { cargarReferencia, invalidarReferencia } from '../api/referencias.js';
import { notificar } from '../stores/notificaciones.js';
import IconoSvg from '../components/IconoSvg.vue';
import TablaDatos from '../components/TablaDatos.vue';
import ModalFormulario from '../components/ModalFormulario.vue';
import ModalConfirmar from '../components/ModalConfirmar.vue';

const route = useRoute();

const clave = ref(route.params.clave);
const def = computed(() => recursos[clave.value]);

const filas = ref([]);
const total = ref(0);
const pagina = ref(1);
const limite = ref(10);
const paginas = ref(1);
const cargando = ref(false);
const busqueda = ref('');
const mapasFk = reactive({});

const modalAbierto = ref(false);
const registroEditar = ref(null);
const registroEliminar = ref(null);
const eliminando = ref(false);

// Carga los mapas id->nombre para las columnas de tipo fk.
async function cargarMapasFk() {
  const refs = [...new Set(def.value.columnas.filter((c) => c.tipo === 'fk').map((c) => c.referencia))];
  for (const r of refs) {
    try {
      const { mapa } = await cargarReferencia(r);
      mapasFk[r] = mapa;
    } catch {
      mapasFk[r] = {};
    }
  }
}

async function cargar() {
  cargando.value = true;
  try {
    const buscandoTexto = busqueda.value.trim().length > 0;
    // Si hay texto de busqueda, se trae el catalogo completo del recurso
    // (no solo la pagina visible) para que la busqueda alcance a todos
    // los registros y no de falso "no encontrado" en registros que
    // simplemente estan en otra pagina.
    const params = buscandoTexto
      ? { pagina: 1, limite: 1000 }
      : { pagina: pagina.value, limite: limite.value };
    const resp = await http.listar(def.value.ruta, params);
    filas.value = resp?.datos ?? [];
    total.value = resp?.total ?? 0;
    paginas.value = buscandoTexto ? 1 : (resp?.paginas ?? 1);
    await cargarMapasFk();
  } catch (e) {
    notificar(e.message || 'No se pudo cargar la informacion', 'error');
    filas.value = [];
  } finally {
    cargando.value = false;
  }
}

// Filtro de texto sobre las filas cargadas (todas las columnas visibles).
// Cuando hay busqueda, "filas" ya contiene el catalogo completo (ver cargar()).
const filasFiltradas = computed(() => {
  const q = busqueda.value.trim().toLowerCase();
  if (!q) return filas.value;
  return filas.value.filter((fila) =>
    def.value.columnas.some((col) => {
      let v = fila[col.campo];
      if (col.tipo === 'fk') v = (mapasFk[col.referencia] || {})[v] ?? v;
      return String(v ?? '').toLowerCase().includes(q);
    }),
  );
});

// Total a mostrar en el encabezado: coincidencias de la busqueda si hay
// texto escrito, o el total real del recurso si no se esta buscando.
const totalMostrado = computed(() =>
  busqueda.value.trim() ? filasFiltradas.value.length : total.value,
);

function abrirNuevo() {
  registroEditar.value = null;
  modalAbierto.value = true;
}
function abrirEditar(fila) {
  registroEditar.value = fila;
  modalAbierto.value = true;
}
async function alGuardar() {
  modalAbierto.value = false;
  invalidarReferencia(clave.value); // refresca selects de otras vistas
  await cargar();
}
async function confirmarEliminar() {
  eliminando.value = true;
  try {
    await http.eliminar(def.value.ruta, registroEliminar.value[def.value.pk]);
    notificar(`${def.value.singular} eliminado`);
    invalidarReferencia(clave.value);
    registroEliminar.value = null;
    // Si borramos el ultimo de la pagina, retrocede una pagina.
    if (filas.value.length === 1 && pagina.value > 1) pagina.value -= 1;
    await cargar();
  } catch (e) {
    notificar(e.message || 'No se pudo eliminar', 'error');
  } finally {
    eliminando.value = false;
  }
}

function irPagina(n) {
  if (n < 1 || n > paginas.value) return;
  pagina.value = n;
}

// Reacciona a cambios de recurso, pagina o limite.
watch(() => route.params.clave, (nueva) => {
  if (!nueva) return;
  clave.value = nueva;
  pagina.value = 1;
  busqueda.value = '';
  cargar();
});
watch([pagina, limite], cargar);

// Al escribir en el buscador, se vuelve a cargar (esta vez trayendo todo
// el catalogo, ver cargar()) con un pequeno debounce para no disparar una
// peticion por cada tecla.
let temporizadorBusqueda = null;
watch(busqueda, () => {
  clearTimeout(temporizadorBusqueda);
  temporizadorBusqueda = setTimeout(() => {
    if (pagina.value !== 1) pagina.value = 1; // dispara cargar() via el watch de arriba
    else cargar();
  }, 300);
});

onMounted(cargar);
</script>

<template>
  <section class="vista aparece">
    <div class="barra-superior">
      <div>
        <h2 class="tit">{{ def.etiqueta }}</h2>
        <p class="sub">
          {{ totalMostrado }} registro{{ totalMostrado === 1 ? '' : 's' }}
          {{ busqueda.trim() ? 'encontrado' + (totalMostrado === 1 ? '' : 's') : 'en total' }}
        </p>
      </div>
      <button class="btn btn-primario" @click="abrirNuevo">
        <IconoSvg nombre="mas" :tamano="18" /> Nuevo
      </button>
    </div>

    <div class="herramientas panel">
      <div class="buscador">
        <IconoSvg nombre="lupa" :tamano="18" />
        <input v-model="busqueda" type="text" placeholder="Buscar en todo el catalogo…" />
      </div>
      <label class="limite">
        Mostrar
        <select v-model.number="limite">
          <option :value="10">10</option>
          <option :value="25">25</option>
          <option :value="50">50</option>
          <option :value="100">100</option>
        </select>
      </label>
    </div>

    <TablaDatos
      :columnas="def.columnas"
      :filas="filasFiltradas"
      :pk="def.pk"
      :mapas-fk="mapasFk"
      :cargando="cargando"
      @editar="abrirEditar"
      @eliminar="registroEliminar = $event"
    />

    <div class="paginacion" v-if="paginas > 1">
      <span class="info">Pagina {{ pagina }} de {{ paginas }}</span>
      <div class="controles">
        <button class="btn btn-borde" :disabled="pagina <= 1" @click="irPagina(pagina - 1)">
          <IconoSvg nombre="izquierda" :tamano="16" /> Anterior
        </button>
        <button class="btn btn-borde" :disabled="pagina >= paginas" @click="irPagina(pagina + 1)">
          Siguiente <IconoSvg nombre="derecha" :tamano="16" />
        </button>
      </div>
    </div>

    <ModalFormulario
      v-if="modalAbierto"
      :def="def"
      :registro="registroEditar"
      @cerrar="modalAbierto = false"
      @guardado="alGuardar"
    />
    <ModalConfirmar
      v-if="registroEliminar"
      :titulo="`Eliminar ${def.singular.toLowerCase()}`"
      :mensaje="`Esta accion no se puede deshacer. Se eliminara el registro #${registroEliminar[def.pk]}.`"
      :ocupado="eliminando"
      @confirmar="confirmarEliminar"
      @cerrar="registroEliminar = null"
    />
  </section>
</template>

<style scoped>
.barra-superior {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
  gap: 16px;
}
.tit {
  margin: 0;
  font-size: 22px;
}
.sub {
  margin: 3px 0 0;
  color: var(--texto-tenue);
  font-size: 13px;
}
.herramientas {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 12px 14px;
  margin-bottom: 18px;
  flex-wrap: wrap;
}
.buscador {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 200px;
  padding: 8px 12px;
  border-radius: var(--radio-chico);
  background: var(--fondo-panel-2);
  border: 1px solid var(--borde);
  color: var(--texto-tenue);
}
.buscador input {
  border: none;
  background: none;
  color: var(--texto);
  font-size: 14px;
  width: 100%;
  outline: none;
  font-family: inherit;
}
.limite {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--texto-tenue);
  white-space: nowrap;
}
.limite select {
  padding: 7px 10px;
  border-radius: var(--radio-chico);
  border: 1px solid var(--borde);
  background: var(--fondo-panel-2);
  color: var(--texto);
  font-family: inherit;
}
.paginacion {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 18px;
  gap: 14px;
  flex-wrap: wrap;
}
.info {
  font-size: 13px;
  color: var(--texto-tenue);
}
.controles {
  display: flex;
  gap: 8px;
}
</style>
