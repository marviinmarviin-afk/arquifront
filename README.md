# Farmacia Frontend TDS

Panel administrativo en **Vue 3 + Vite** para el backend `farmacia-backend-tds`
(NestJS + TypeORM + PostgreSQL). Consume la API con `fetch` nativo, sin axios
y sin librerias de UI ni de graficas. Los componentes son HTML/CSS/JS puro.

## Dependencias

Solo dos paquetes de runtime y dos de desarrollo:

| Paquete | Rol |
|---|---|
| `vue` | framework |
| `vue-router` | ruteo entre vistas |
| `vite` | servidor de desarrollo y build (dev) |
| `@vitejs/plugin-vue` | soporte de `.vue` en Vite (dev) |

No se usa: axios, pinia, vuetify, primevue, chart.js, tailwind, ni iconos externos.
Las peticiones van con `fetch`, el estado global es `reactive`, las graficas son
SVG hechas a mano y los iconos son SVG en linea.

## Instalacion

```bash
npm install
```

Eso instala todo lo del `package.json`. No hace falta ningun `npm install`
adicional.

## Configuracion

La URL del backend se define en `.env`:

```
VITE_API_URL=http://localhost:3000/api
```

Cambiala si el backend corre en otro host o puerto. Incluye el prefijo `/api`.

## Ejecutar

1. Levanta el backend NestJS (`npm run start:dev` en su carpeta). Ya trae CORS.
2. En esta carpeta:

```bash
npm run dev
```

Abre en `http://localhost:5173`.

## Estructura

```
src/
  api/
    http.js          Cliente fetch (listar, buscar, crear, actualizar, eliminar)
    recursos.js      Config declarativa de los 14 recursos (columnas y campos)
    referencias.js   Resuelve llaves foraneas (id -> nombre) con cache
    formato.js       Formato de moneda (GTQ), fechas y utilidades
  components/
    AppSidebar.vue   Barra lateral agrupada por dominio
    AppNavbar.vue    Barra superior + interruptor de tema
    TablaDatos.vue   Tabla generica reutilizable
    ModalFormulario.vue  Formulario generico crear/editar
    ModalConfirmar.vue   Confirmacion de borrado
    GraficoLineas.vue    Mini-grafica de area en SVG puro
    NotificacionesToast.vue  Avisos tipo toast
    IconoSvg.vue     Iconos SVG en linea
  views/
    DashboardView.vue  Panel con metricas reales
    RecursoView.vue    CRUD generico (sirve a los 14 recursos)
  stores/
    tema.js          Tema oscuro/claro (persistido en localStorage)
    notificaciones.js  Estado de los toasts
  router/index.js    Rutas
  styles/tema.css    Variables de tema (oscuro y claro) y estilos base
```

## Temas

Arriba a la derecha esta el interruptor sol/luna. El tema se guarda en
`localStorage` y se aplica con `data-tema="oscuro | claro"` en `<html>`.
Los colores viven como variables CSS en `styles/tema.css`.

## Como agregar un recurso nuevo

No hay que tocar componentes: se agrega una entrada en `src/api/recursos.js`
(igual que extender `BaseService` en el backend) y el CRUD queda listo.
