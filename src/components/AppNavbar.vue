<script setup>
import { ref } from 'vue';
import IconoSvg from './IconoSvg.vue';
import { tema, alternarTema } from '../stores/tema.js';

defineProps({ titulo: { type: String, default: '' } });
defineEmits(['alternar-barra']);

const menuUsuario = ref(false);
</script>

<template>
  <header class="navbar panel">
    <div class="izq">
      <button class="btn-icono" @click="$emit('alternar-barra')" aria-label="Menu">
        <IconoSvg nombre="menu" :tamano="22" />
      </button>
      <h1 class="titulo">{{ titulo }}</h1>
    </div>

    <div class="der">
      <button
        class="btn-icono"
        @click="alternarTema"
        :aria-label="tema.actual === 'oscuro' ? 'Activar tema claro' : 'Activar tema oscuro'"
        :title="tema.actual === 'oscuro' ? 'Tema claro' : 'Tema oscuro'"
      >
        <IconoSvg :nombre="tema.actual === 'oscuro' ? 'sol' : 'luna'" :tamano="20" />
      </button>

      <div class="usuario-caja">
        <div class="usuario" @click="menuUsuario = !menuUsuario">
          <div class="avatar">AM</div>
          <div class="usuario-txt">
            <strong>Administrador</strong>
            <small>Farmacia TDS</small>
          </div>
          <IconoSvg nombre="chevron" :tamano="16" />
        </div>
        <div v-if="menuUsuario" class="menu-usuario panel" @click="menuUsuario = false">
          <div class="menu-usuario-item info">
            <strong>Administrador</strong>
            <small>Farmacia TDS</small>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 18px;
  border-radius: var(--radio);
  margin-bottom: 22px;
}
.izq,
.der {
  display: flex;
  align-items: center;
  gap: 14px;
}
.titulo {
  font-size: 19px;
  font-weight: 700;
  margin: 0;
}
.usuario-caja {
  position: relative;
}
.usuario {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 10px 5px 6px;
  border-radius: 30px;
  cursor: pointer;
  transition: var(--transicion);
}
.usuario:hover {
  background: var(--fondo-panel-2);
}
.menu-usuario {
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  min-width: 180px;
  padding: 6px;
  z-index: 130;
}
.menu-usuario-item.info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px 10px;
}
.menu-usuario-item.info small {
  color: var(--texto-tenue);
}
.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--acento);
  color: #fff;
  display: grid;
  place-items: center;
  font-weight: 700;
  font-size: 13px;
}
.usuario-txt {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}
.usuario-txt strong {
  font-size: 13px;
}
.usuario-txt small {
  font-size: 11px;
  color: var(--texto-tenue);
}
@media (max-width: 620px) {
  .usuario-txt {
    display: none;
  }
  .titulo {
    font-size: 16px;
  }
}
</style>
