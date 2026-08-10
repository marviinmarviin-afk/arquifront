<script setup>
import { computed } from 'vue';

// Grafica de area minima dibujada con SVG puro (sin librerias).
const props = defineProps({
  valores: { type: Array, default: () => [] },
  color: { type: String, default: 'var(--acento)' },
  ancho: { type: Number, default: 260 },
  alto: { type: Number, default: 70 },
});

const id = `g${Math.random().toString(36).slice(2, 8)}`;

const rutas = computed(() => {
  const v = props.valores.length ? props.valores : [0, 0];
  const max = Math.max(...v, 1);
  const min = Math.min(...v, 0);
  const rango = max - min || 1;
  const pasoX = props.ancho / (v.length - 1 || 1);
  const margen = 6;
  const utilAlto = props.alto - margen * 2;

  const puntos = v.map((valor, i) => {
    const x = i * pasoX;
    const y = margen + utilAlto - ((valor - min) / rango) * utilAlto;
    return [x, y];
  });

  const linea = puntos.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const area = `${linea} L${props.ancho},${props.alto} L0,${props.alto} Z`;
  return { linea, area };
});
</script>

<template>
  <svg :viewBox="`0 0 ${ancho} ${alto}`" preserveAspectRatio="none" class="spark">
    <defs>
      <linearGradient :id="id" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" :stop-color="color" stop-opacity="0.32" />
        <stop offset="100%" :stop-color="color" stop-opacity="0" />
      </linearGradient>
    </defs>
    <path :d="rutas.area" :fill="`url(#${id})`" />
    <path :d="rutas.linea" fill="none" :stroke="color" stroke-width="2" stroke-linejoin="round" />
  </svg>
</template>

<style scoped>
.spark {
  width: 100%;
  height: 70px;
  display: block;
}
</style>
