<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue';
import IconoSvg from './IconoSvg.vue';
import { http } from '../api/http.js';
import { cargarReferencia } from '../api/referencias.js';
import { aValorInputFecha } from '../api/formato.js';
import { notificar } from '../stores/notificaciones.js';

const props = defineProps({
  def: { type: Object, required: true },
  registro: { type: Object, default: null }, // null = crear
});
const emit = defineEmits(['cerrar', 'guardado']);

const editando = computed(() => props.registro !== null);
const guardando = ref(false);
const opcionesFk = reactive({}); // referencia -> [{valor,texto}]
const modelo = reactive({});

// Campos visibles: en edicion se ocultan los marcados "soloCrear".
const camposVisibles = computed(() =>
  props.def.campos.filter((c) => !(c.soloCrear && editando.value)),
);

// Inicializa el modelo del formulario.
function inicializar() {
  for (const campo of props.def.campos) {
    let valor;
    if (editando.value) {
      valor = props.registro[campo.campo];
      if (campo.tipo === 'fecha') valor = aValorInputFecha(valor);
    } else {
      valor = campo.valorInicial !== undefined ? campo.valorInicial : campo.tipo === 'booleano' ? false : '';
    }
    modelo[campo.campo] = valor ?? '';
  }
}

// Carga opciones de los campos tipo select.
async function cargarOpciones() {
  const refs = [...new Set(props.def.campos.filter((c) => c.tipo === 'select').map((c) => c.referencia))];
  for (const r of refs) {
    try {
      const { opciones } = await cargarReferencia(r);
      opcionesFk[r] = opciones;
    } catch {
      opcionesFk[r] = [];
    }
  }
}

// Construye el payload respetando los DTO (solo campos permitidos).
function construirPayload() {
  const payload = {};
  for (const campo of camposVisibles.value) {
    const v = modelo[campo.campo];
    if (campo.tipo === 'booleano') {
      payload[campo.campo] = !!v;
      continue;
    }
    const vacio = v === '' || v === null || v === undefined;
    if (vacio) continue; // no enviar opcionales vacios
    if (campo.tipo === 'entero') payload[campo.campo] = parseInt(v, 10);
    else if (campo.tipo === 'numero' || campo.tipo === 'moneda') payload[campo.campo] = Number(v);
    else if (campo.tipo === 'select') payload[campo.campo] = Number(v);
    else payload[campo.campo] = v;
  }
  return payload;
}

function validar() {
  for (const campo of camposVisibles.value) {
    if (campo.obligatorio) {
      const v = modelo[campo.campo];
      if (v === '' || v === null || v === undefined) {
        notificar(`El campo "${campo.etiqueta}" es obligatorio`, 'error');
        return false;
      }
    }
  }
  return true;
}

async function guardar() {
  if (!validar()) return;
  guardando.value = true;
  try {
    const payload = construirPayload();
    if (editando.value) {
      await http.actualizar(props.def.ruta, props.registro[props.def.pk], payload);
      notificar(`${props.def.singular} actualizado`);
    } else {
      await http.crear(props.def.ruta, payload);
      notificar(`${props.def.singular} creado`);
    }
    emit('guardado');
  } catch (e) {
    notificar(e.message || 'No se pudo guardar', 'error');
  } finally {
    guardando.value = false;
  }
}

function alPresionar(e) {
  if (e.key === 'Escape') emit('cerrar');
}

onMounted(() => {
  inicializar();
  cargarOpciones();
  window.addEventListener('keydown', alPresionar);
});
onBeforeUnmount(() => window.removeEventListener('keydown', alPresionar));
</script>

<template>
  <div class="fondo" @click.self="$emit('cerrar')">
    <div class="modal panel aparece" role="dialog" aria-modal="true">
      <div class="cabecera">
        <h2>{{ editando ? 'Editar' : 'Nuevo' }} {{ def.singular.toLowerCase() }}</h2>
        <button class="btn-icono" @click="$emit('cerrar')" aria-label="Cerrar">
          <IconoSvg nombre="cerrar" :tamano="20" />
        </button>
      </div>

      <form class="cuerpo" @submit.prevent="guardar">
        <div class="rejilla">
          <div v-for="campo in camposVisibles" :key="campo.campo" class="campo" :class="{ ancho: campo.tipo === 'booleano' }">
            <label :for="campo.campo">
              {{ campo.etiqueta }}
              <span v-if="campo.obligatorio" class="obligatorio">*</span>
            </label>

            <!-- Booleano: interruptor -->
            <label v-if="campo.tipo === 'booleano'" class="switch">
              <input :id="campo.campo" type="checkbox" v-model="modelo[campo.campo]" />
              <span class="pista"><span class="bolita"></span></span>
            </label>

            <!-- Select (llave foranea) -->
            <select v-else-if="campo.tipo === 'select'" :id="campo.campo" v-model="modelo[campo.campo]">
              <option value="">— Seleccionar —</option>
              <option v-for="op in opcionesFk[campo.referencia] || []" :key="op.valor" :value="op.valor">
                {{ op.texto }}
              </option>
            </select>

            <!-- Fecha -->
            <input v-else-if="campo.tipo === 'fecha'" :id="campo.campo" type="date" v-model="modelo[campo.campo]" />

            <!-- Numericos -->
            <input
              v-else-if="campo.tipo === 'entero' || campo.tipo === 'numero' || campo.tipo === 'moneda'"
              :id="campo.campo"
              type="number"
              :step="campo.tipo === 'entero' ? '1' : '0.01'"
              min="0"
              v-model="modelo[campo.campo]"
            />

            <!-- Contrasena -->
            <input
              v-else-if="campo.tipo === 'password'"
              :id="campo.campo"
              type="password"
              :maxlength="campo.max"
              v-model="modelo[campo.campo]"
            />

            <!-- Texto -->
            <input v-else :id="campo.campo" type="text" :maxlength="campo.max" v-model="modelo[campo.campo]" />
          </div>
        </div>

        <div class="pie">
          <button type="button" class="btn btn-borde" @click="$emit('cerrar')">Cancelar</button>
          <button type="submit" class="btn btn-primario" :disabled="guardando">
            {{ guardando ? 'Guardando…' : editando ? 'Guardar cambios' : 'Crear' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.fondo {
  position: fixed;
  inset: 0;
  background: rgba(10, 14, 20, 0.55);
  backdrop-filter: blur(2px);
  display: grid;
  place-items: center;
  padding: 20px;
  z-index: 150;
}
.modal {
  width: 100%;
  max-width: 620px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}
.cabecera {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 22px;
  border-bottom: 1px solid var(--borde);
}
.cabecera h2 {
  margin: 0;
  font-size: 17px;
}
.cuerpo {
  overflow-y: auto;
  padding: 22px;
}
.rejilla {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.campo.ancho {
  grid-column: 1 / -1;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background: var(--fondo-panel-2);
  padding: 10px 14px;
  border-radius: var(--radio-chico);
}
.campo.ancho label:first-child {
  margin: 0;
}
.pie {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 24px;
}
@media (max-width: 560px) {
  .rejilla {
    grid-template-columns: 1fr;
  }
}
</style>
