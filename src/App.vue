<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { recursos } from './api/recursos.js';
import AppSidebar from './components/AppSidebar.vue';
import AppNavbar from './components/AppNavbar.vue';
import NotificacionesToast from './components/NotificacionesToast.vue';

const route = useRoute();

// La barra inicia cerrada en pantallas chicas.
const barraAbierta = ref(window.innerWidth > 900);

const tituloActual = computed(() => {
  if (route.name === 'recurso') {
    const def = recursos[route.params.clave];
    return def ? def.etiqueta : 'Recurso';
  }
  return 'Panel';
});

function alternarBarra() {
  barraAbierta.value = !barraAbierta.value;
}
// En movil, al navegar se cierra la barra.
function cerrarEnMovil() {
  if (window.innerWidth <= 900) barraAbierta.value = false;
}
</script>

<template>
  <div class="app">
    <AppSidebar :abierto="barraAbierta" @navegar="cerrarEnMovil" />

    <!-- Fondo oscuro para cerrar la barra en movil -->
    <div v-if="barraAbierta" class="capa-movil" @click="cerrarEnMovil"></div>

    <div class="principal">
      <div class="contenido">
        <AppNavbar :titulo="tituloActual" @alternar-barra="alternarBarra" />
        <main>
          <router-view />
        </main>
      </div>
    </div>

    <NotificacionesToast />
  </div>
</template>

<style scoped>
.app {
  display: flex;
  min-height: 100vh;
}
.principal {
  flex: 1;
  min-width: 0;
}
.contenido {
  max-width: 1280px;
  margin: 0 auto;
  padding: 20px 24px 40px;
}
.capa-movil {
  display: none;
}
@media (max-width: 900px) {
  .app :deep(.barra) {
    position: fixed;
    z-index: 120;
  }
  .capa-movil {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    z-index: 110;
  }
  .contenido {
    padding: 16px;
  }
}
</style>
