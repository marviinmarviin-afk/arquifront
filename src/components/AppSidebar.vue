<script setup>
import { listaRecursos, grupos } from '../api/recursos.js';
import IconoSvg from './IconoSvg.vue';

defineProps({ abierto: { type: Boolean, default: true } });
defineEmits(['navegar']);

const recursos = listaRecursos();
function porGrupo(grupo) {
  return recursos.filter((r) => r.grupo === grupo);
}
</script>

<template>
  <aside class="barra" :class="{ oculta: !abierto }">
    <div class="marca">
      <span class="cruz" aria-hidden="true">
        <span></span><span></span>
      </span>
      <div class="marca-txt">
        <strong>Farmacia</strong>
        <small>TDS 2026</small>
      </div>
    </div>

    <nav class="menu">
      <router-link
        to="/"
        class="enlace"
        active-class="activo"
        exact-active-class="activo"
        @click="$emit('navegar')"
      >
        <IconoSvg nombre="tablero" :tamano="18" />
        <span>Panel</span>
      </router-link>

      <template v-for="grupo in grupos" :key="grupo">
        <p class="grupo">{{ grupo }}</p>
        <router-link
          v-for="r in porGrupo(grupo)"
          :key="r.clave"
          :to="`/recurso/${r.clave}`"
          class="enlace"
          active-class="activo"
          @click="$emit('navegar')"
        >
          <IconoSvg :nombre="r.icono" :tamano="18" />
          <span>{{ r.etiqueta }}</span>
        </router-link>
      </template>
    </nav>
  </aside>
</template>

<style scoped>
.barra {
  width: var(--ancho-sidebar);
  min-width: var(--ancho-sidebar);
  height: 100vh;
  position: sticky;
  top: 0;
  background: var(--fondo-sidebar);
  border-right: 1px solid var(--borde);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  transition: margin-left var(--transicion);
}
.barra.oculta {
  margin-left: calc(var(--ancho-sidebar) * -1);
}

.marca {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 22px;
  position: sticky;
  top: 0;
  background: var(--fondo-sidebar);
  z-index: 1;
}
/* Cruz de farmacia dibujada con dos barras (identidad de marca) */
.cruz {
  position: relative;
  width: 30px;
  height: 30px;
  border-radius: 9px;
  background: var(--acento);
  flex-shrink: 0;
}
.cruz span {
  position: absolute;
  background: #fff;
  border-radius: 2px;
}
.cruz span:first-child {
  width: 14px;
  height: 4px;
  top: 13px;
  left: 8px;
}
.cruz span:last-child {
  width: 4px;
  height: 14px;
  top: 8px;
  left: 13px;
}
.marca-txt {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
}
.marca-txt strong {
  font-size: 17px;
  letter-spacing: 0.3px;
}
.marca-txt small {
  font-size: 11px;
  color: var(--texto-tenue);
  letter-spacing: 1px;
}

.menu {
  padding: 4px 12px 24px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.grupo {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--texto-tenue);
  margin: 18px 10px 6px;
}
.enlace {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: var(--radio-chico);
  color: var(--texto-tenue);
  font-size: 14px;
  font-weight: 500;
  transition: var(--transicion);
}
.enlace:hover {
  background: var(--fondo-panel-2);
  color: var(--texto);
}
.enlace.activo {
  background: var(--acento-suave);
  color: var(--acento);
  font-weight: 600;
}
.enlace.activo :deep(svg) {
  color: var(--acento);
}
</style>
