// =====================================================
// Cliente HTTP minimo sobre fetch nativo (sin axios).
// Encapsula el backend NestJS para que las vistas no
// dependan de los detalles de fetch.
// =====================================================

const URL_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Construye una query string a partir de un objeto simple.
function armarQuery(params = {}) {
  const partes = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
  return partes.length ? `?${partes.join('&')}` : '';
}

// Procesa la respuesta: lanza error legible si el backend responde mal.
async function procesar(respuesta) {
  if (respuesta.status === 204) return null; // DELETE / sin contenido

  let cuerpo = null;
  const texto = await respuesta.text();
  if (texto) {
    try {
      cuerpo = JSON.parse(texto);
    } catch {
      cuerpo = texto;
    }
  }

  if (!respuesta.ok) {
    // NestJS suele devolver { message, error, statusCode }
    let mensaje = `Error ${respuesta.status}`;
    if (cuerpo && typeof cuerpo === 'object' && cuerpo.message) {
      mensaje = Array.isArray(cuerpo.message)
        ? cuerpo.message.join(' · ')
        : cuerpo.message;
    } else if (typeof cuerpo === 'string' && cuerpo) {
      mensaje = cuerpo;
    }
    throw new Error(mensaje);
  }

  return cuerpo;
}

async function pedir(metodo, ruta, { params, datos } = {}) {
  const opciones = {
    method: metodo,
    headers: { 'Content-Type': 'application/json' },
  };
  if (datos !== undefined) opciones.body = JSON.stringify(datos);
  
  const respuesta = await fetch(`${URL_BASE}/${ruta}${armarQuery(params)}`, opciones);
  return procesar(respuesta);
}

export const http = {
  // GET /<ruta>?pagina&limite  -> { datos, total, pagina, limite, paginas }
  listar: (ruta, params) => pedir('GET', ruta, { params }),
  // GET /<ruta>/:id
  buscar: (ruta, id) => pedir('GET', `${ruta}/${id}`),
  // POST /<ruta>
  crear: (ruta, datos) => pedir('POST', ruta, { datos }),
  // PATCH /<ruta>/:id
  actualizar: (ruta, id, datos) => pedir('PATCH', `${ruta}/${id}`, { datos }),
  // DELETE /<ruta>/:id
  eliminar: (ruta, id) => pedir('DELETE', `${ruta}/${id}`),
};

export { URL_BASE };
