// =====================================================
// Utilidades de formato para mostrar valores en tablas.
// =====================================================

const monedaGTQ = new Intl.NumberFormat('es-GT', {
  style: 'currency',
  currency: 'GTQ',
});

export function formatearMoneda(valor) {
  const n = Number(valor);
  return Number.isFinite(n) ? monedaGTQ.format(n) : '—';
}

export function formatearFecha(valor) {
  if (!valor) return '—';
  const d = new Date(valor);
  if (Number.isNaN(d.getTime())) return String(valor);
  // Fecha local Guatemala (sin depender de librerias externas)
  return d.toLocaleDateString('es-GT', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
}

// Convierte 'YYYY-MM-DD...' a 'YYYY-MM-DD' para inputs date.
export function aValorInputFecha(valor) {
  if (!valor) return '';
  return String(valor).slice(0, 10);
}

// Dias que faltan para una fecha (negativo = ya paso).
export function diasHasta(fecha) {
  if (!fecha) return null;
  const objetivo = new Date(fecha);
  if (Number.isNaN(objetivo.getTime())) return null;
  const hoy = new Date();
  const ms = objetivo.setHours(0, 0, 0, 0) - hoy.setHours(0, 0, 0, 0);
  return Math.round(ms / 86400000);
}
