import "./assets/css/main.css";

import { createPinia } from "pinia";
import { createApp } from "vue";

import App from "./App.vue";
import router from "./router";

import filters from "@alexochihua/exos-functionality/dist/filters";
import { ExosLibraryComponents } from "@alexochihua/exos-library-components";
import VueApexCharts from "vue3-apexcharts";

const app = createApp(App);

app.use(createPinia());
app.use(filters);
app.use(ExosLibraryComponents);
app.use(router);
app.use(VueApexCharts);

app.mount("#app");
