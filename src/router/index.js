import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/simulator",
    },
    {
      path: "/",
      component: () => import("../layouts/MainTpl.vue"),
      children: [
        {
          path: "/simulator",
          name: "simulator-form",
          component: () => import("../views/simulator/Simulator.vue"),
        },
      ],
    },
  ],
});

export default router;
