// =====================================================
// Resuelve llaves foraneas: descarga los recursos referenciados
// y arma un mapa  id -> etiqueta  para mostrar nombres en vez
// de numeros. Cachea en memoria para no repetir peticiones.
// =====================================================
import { http } from './http.js';
import { recursos } from './recursos.js';

const cache = new Map(); // clave -> { opciones:[{valor,texto}], mapa:{ id: texto } }

// Etiqueta legible de una fila segun su recurso.
function etiquetaDeFila(clave, fila) {
  const def = recursos[clave];
  if (def.campoEtiqueta && fila[def.campoEtiqueta] != null) {
    return String(fila[def.campoEtiqueta]);
  }
  return `#${fila[def.pk]}`;
}

// Carga (o devuelve de cache) las opciones de un recurso referenciado.
export async function cargarReferencia(clave, forzar = false) {
  if (!forzar && cache.has(clave)) return cache.get(clave);

  const def = recursos[clave];
  // Traemos un lote grande; suficiente para un proyecto academico.
  const respuesta = await http.listar(def.ruta, { pagina: 1, limite: 100 });
  const filas = respuesta?.datos ?? [];

  const opciones = filas.map((f) => ({
    valor: f[def.pk],
    texto: etiquetaDeFila(clave, f),
  }));
  const mapa = {};
  opciones.forEach((o) => {
    mapa[o.valor] = o.texto;
  });

  const resultado = { opciones, mapa };
  cache.set(clave, resultado);
  return resultado;
}

// Invalida una referencia (tras crear/editar en ese recurso).
export function invalidarReferencia(clave) {
  cache.delete(clave);
}
