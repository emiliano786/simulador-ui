import './assets/css/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import { i18n } from './i18n';

import { ExosLibraryComponents } from '@alexochihua/exos-library-components';
import filters from '@alexochihua/exos-functionality/dist/filters';
import VueApexCharts from 'vue3-apexcharts';

const app = createApp(App);

app.use(i18n);
app.use(createPinia());
app.use(filters);
app.use(ExosLibraryComponents);
app.use(router);
app.use(VueApexCharts);

app.mount('#app');
