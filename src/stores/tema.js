// =====================================================
// Store de tema (oscuro / claro) sin Pinia: solo reactive.
// Persiste en localStorage y aplica data-tema en <html>.
// =====================================================
import { reactive, watch } from 'vue';

const CLAVE = 'farmacia-tema';
const inicial = localStorage.getItem(CLAVE) || 'oscuro';

export const tema = reactive({ actual: inicial });

function aplicar(valor) {
  document.documentElement.setAttribute('data-tema', valor);
}

aplicar(tema.actual);

watch(
  () => tema.actual,
  (valor) => {
    aplicar(valor);
    localStorage.setItem(CLAVE, valor);
  },
);

export function alternarTema() {
  tema.actual = tema.actual === 'oscuro' ? 'claro' : 'oscuro';
}
