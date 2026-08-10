import { createApp } from 'vue';
import App from './App.vue';
import { router } from './router/index.js';
import './styles/tema.css';
// Se importa para que el tema se aplique al arrancar.
import './stores/tema.js';

createApp(App).use(router).mount('#app');
