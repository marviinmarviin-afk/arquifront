<script setup>
import IconoSvg from './IconoSvg.vue';
defineProps({
  titulo: { type: String, default: 'Confirmar' },
  mensaje: { type: String, default: '' },
  ocupado: { type: Boolean, default: false },
});
defineEmits(['confirmar', 'cerrar']);
</script>

<template>
  <div class="fondo" @click.self="$emit('cerrar')">
    <div class="modal panel aparece" role="alertdialog" aria-modal="true">
      <div class="icono"><IconoSvg nombre="alerta" :tamano="24" /></div>
      <h2>{{ titulo }}</h2>
      <p>{{ mensaje }}</p>
      <div class="pie">
        <button class="btn btn-borde" @click="$emit('cerrar')">Cancelar</button>
        <button class="btn btn-peligro" :disabled="ocupado" @click="$emit('confirmar')">
          {{ ocupado ? 'Eliminando…' : 'Eliminar' }}
        </button>
      </div>
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
  z-index: 160;
}
.modal {
  width: 100%;
  max-width: 400px;
  padding: 26px;
  text-align: center;
}
.icono {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: var(--peligro-suave);
  color: var(--peligro);
  display: grid;
  place-items: center;
  margin: 0 auto 14px;
}
h2 {
  margin: 0 0 6px;
  font-size: 18px;
}
p {
  margin: 0 0 22px;
  color: var(--texto-tenue);
  font-size: 14px;
  line-height: 1.5;
}
.pie {
  display: flex;
  gap: 10px;
  justify-content: center;
}
</style>
