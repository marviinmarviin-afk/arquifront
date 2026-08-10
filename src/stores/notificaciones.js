// =====================================================
// Store de notificaciones tipo "toast", sin librerias.
// =====================================================
import { reactive } from 'vue';

let contador = 0;
export const notificaciones = reactive({ lista: [] });

export function notificar(mensaje, tipo = 'exito') {
  const id = ++contador;
  notificaciones.lista.push({ id, mensaje, tipo });
  setTimeout(() => quitar(id), 3800);
}

export function quitar(id) {
  const i = notificaciones.lista.findIndex((n) => n.id === id);
  if (i !== -1) notificaciones.lista.splice(i, 1);
}
