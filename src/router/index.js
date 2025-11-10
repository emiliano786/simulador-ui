import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/',
      component: () => import('../layouts/MainTpl.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '/deploys/detail',
          name: 'deploys-form',
          component: () => import('../views/deploys/Form.vue')
        },
        {
          path: '/profiles',
          name: 'profiles-query',
          component: () => import('../views/profiles/Query.vue')
        },
        {
          path: '/user-profiles',
          name: 'user-profiles',
          component: () => import('../views/user-profiles/profiles.vue')
        },
        {
          path: 'add-profile',
          name: 'create-profile',
          component: () => import('../views/user-profiles/createProfile.vue')
        },
        {
          path: '/profiles/detail',
          name: 'profiles-form',
          component: () => import('../views/profiles/Form.vue')
        },
        {
          path: '/deploys-query',
          name: 'deploys-query',
          component: () => import('../views/deploys/Query.vue')
        },
        {
          path: '/deploys/delete',
          name: 'deploys-delete',
          component: () => import('../views/deploys/Delete.vue')
        }
      ]
    }
  ]
});

// Guardia de navegación para verificar autenticación
router.beforeEach(async (to, from, next) => {
  // Si la ruta requiere autenticación
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // Importar el store dinámicamente para evitar problemas de inicialización
    const { useAuthStore } = await import('../stores/auth');
    const authStore = useAuthStore();

    // Si aún está cargando la autenticación, esperar
    if (authStore.isLoading) {
      await authStore.initializeAuth();
    }

    // Verificar si el usuario está autenticado
    if (!authStore.hasAuthenticatedUser()) {
      // Si no está autenticado, redirigir al login
      next({ name: 'login' });
    } else {
      // Si está autenticado, permitir acceso
      next();
    }
  } else {
    // Si la ruta no requiere autenticación, permitir acceso
    next();
  }
});

export default router;
