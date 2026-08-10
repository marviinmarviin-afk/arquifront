<script setup>
import IconoSvg from './IconoSvg.vue';
import { formatearMoneda, formatearFecha } from '../api/formato.js';

const props = defineProps({
  columnas: { type: Array, required: true },
  filas: { type: Array, default: () => [] },
  pk: { type: String, required: true },
  mapasFk: { type: Object, default: () => ({}) },
  cargando: { type: Boolean, default: false },
});
defineEmits(['editar', 'eliminar']);

// Devuelve el valor formateado de una celda segun el tipo de columna.
function celda(fila, col) {
  const valor = fila[col.campo];
  if (col.tipo === 'fk') {
    const mapa = props.mapasFk[col.referencia] || {};
    return mapa[valor] ?? (valor != null ? `#${valor}` : '—');
  }
  if (col.tipo === 'moneda') return formatearMoneda(valor);
  if (col.tipo === 'fecha') return formatearFecha(valor);
  if (valor === null || valor === undefined || valor === '') return '—';
  return valor;
}
</script>

<template>
  <div class="envoltura panel">
    <table class="tabla">
      <thead>
        <tr>
          <th v-for="col in columnas" :key="col.campo">{{ col.titulo }}</th>
          <th class="acciones-th">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="cargando">
          <td :colspan="columnas.length + 1" class="vacio">Cargando…</td>
        </tr>
        <tr v-else-if="!filas.length">
          <td :colspan="columnas.length + 1" class="vacio">
            No hay registros. Usa “Nuevo” para agregar el primero.
          </td>
        </tr>
        <tr v-for="fila in filas" :key="fila[pk]" v-else>
          <td v-for="col in columnas" :key="col.campo">
            <span v-if="col.tipo === 'booleano'" class="insignia" :class="fila[col.campo] ? 'activo' : 'inactivo'">
              {{ fila[col.campo] ? 'Activo' : 'Inactivo' }}
            </span>
            <span v-else>{{ celda(fila, col) }}</span>
          </td>
          <td class="acciones">
            <button class="btn-icono" title="Editar" @click="$emit('editar', fila)">
              <IconoSvg nombre="editar" :tamano="17" />
            </button>
            <button class="btn-icono peligro" title="Eliminar" @click="$emit('eliminar', fila)">
              <IconoSvg nombre="basura" :tamano="17" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.envoltura {
  overflow-x: auto;
}
.tabla {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}
thead th {
  text-align: left;
  padding: 14px 16px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  color: var(--texto-tenue);
  border-bottom: 1px solid var(--borde);
  white-space: nowrap;
}
tbody td {
  padding: 13px 16px;
  border-bottom: 1px solid var(--borde);
  color: var(--texto);
}
tbody tr:last-child td {
  border-bottom: none;
}
tbody tr {
  transition: background var(--transicion);
}
tbody tr:hover {
  background: var(--fondo-panel-2);
}
.acciones-th {
  text-align: right;
}
.acciones {
  display: flex;
  gap: 4px;
  justify-content: flex-end;
}
.btn-icono.peligro:hover {
  color: var(--peligro);
}
.vacio {
  text-align: center;
  padding: 40px 16px;
  color: var(--texto-tenue);
}
</style>
