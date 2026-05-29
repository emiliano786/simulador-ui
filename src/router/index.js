import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/login",
    },
    {
      path: "/login",
      name: "login-form",
      component: () => import("../views/Login.vue"),
    },
    {
      path: "/",
      component: () => import("../layouts/MainTpl.vue"),
      meta: { requiresAuth: true },
      children: [
        {
          path: "simulator",
          name: "simulator-form",
          component: () => import("../views/simulator/Simulator.vue"),
        },
        {
          path: "users",
          name: "user-form",
          component: () => import("../views/users/Users.vue"),
        },
        {
          path: "templates",
          name: "template-form",
          component: () => import("../views/template/Template.vue"),
        },
        {
          path: "templates/:name",
          name: "template-detail",
          component: () => import("../views/template/TemplateDetail.vue"),
        },
        {
          path: "parser",
          name: "parser-form",
          component: () => import("../views/parser/Parser.vue"),
        }
      ],
    },
  ],
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("iso_token");
  const userStr = localStorage.getItem("iso_user");

  let role = "user";
  if (userStr) {
    try {
      role = JSON.parse(userStr).role;
    } catch (e) {}
  }

  if (to.meta.requiresAuth && !token) {
    next({ name: "login-form" });
  } else if (to.name === "login-form" && token) {
    next({ name: "simulator-form" });
  } else if (to.name === "user-form" && role === "viewer") {
    next({ name: "simulator-form" });
  } else {
    next();
  }
});

export default router;
