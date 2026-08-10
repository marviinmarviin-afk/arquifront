import { createRouter, createWebHistory } from 'vue-router';
import DashboardView from '../views/DashboardView.vue';
import RecursoView from '../views/RecursoView.vue';
import { recursos } from '../api/recursos.js';

const rutas = [
  { path: '/', name: 'panel', component: DashboardView },
  {
    path: '/recurso/:clave',
    name: 'recurso',
    component: RecursoView,
    // Valida que el recurso exista; si no, manda al panel.
    beforeEnter: (to) => (recursos[to.params.clave] ? true : { path: '/' }),
  },
  { path: '/:pathMatch(.*)*', redirect: '/' },
];

export const router = createRouter({
  history: createWebHistory(),
  routes: rutas,
  scrollBehavior: () => ({ top: 0 }),
});
