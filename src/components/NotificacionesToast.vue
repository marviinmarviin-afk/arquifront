<script setup>
import { notificaciones, quitar } from '../stores/notificaciones.js';
import IconoSvg from './IconoSvg.vue';
</script>

<template>
  <div class="contenedor">
    <div
      v-for="n in notificaciones.lista"
      :key="n.id"
      class="toast aparece"
      :class="n.tipo"
      role="status"
    >
      <IconoSvg :nombre="n.tipo === 'error' ? 'alerta' : 'escudo'" :tamano="18" />
      <span>{{ n.mensaje }}</span>
      <button class="cerrar" @click="quitar(n.id)" aria-label="Cerrar">
        <IconoSvg nombre="cerrar" :tamano="14" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.contenedor {
  position: fixed;
  right: 20px;
  bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 200;
}
.toast {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  min-width: 260px;
  max-width: 360px;
  border-radius: var(--radio-chico);
  background: var(--fondo-panel);
  border: 1px solid var(--borde);
  border-left: 4px solid var(--exito);
  box-shadow: var(--sombra);
  font-size: 14px;
}
.toast.exito {
  border-left-color: var(--exito);
  color: var(--texto);
}
.toast.exito :deep(svg) {
  color: var(--exito);
}
.toast.error {
  border-left-color: var(--peligro);
}
.toast.error :deep(svg) {
  color: var(--peligro);
}
.cerrar {
  margin-left: auto;
  background: none;
  border: none;
  color: var(--texto-tenue);
  cursor: pointer;
  display: grid;
  place-items: center;
}
.cerrar:hover {
  color: var(--texto);
}
</style>
