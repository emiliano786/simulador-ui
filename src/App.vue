<template>
  <div id="app">
    <!-- Mostrar loading mientras se inicializa la autenticación -->
    <div
      v-if="authStore.isLoading"
      class="min-h-screen flex items-center justify-center bg-neutral-white dark:bg-socrates-card-dark"
    >
      <div class="text-center">
        <div
          class="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"
        ></div>
        <p class="text-body-2 text-gray-600 dark:text-gray-400">Inicializando aplicación...</p>
      </div>
    </div>

    <!-- Mostrar la aplicación cuando esté lista -->
    <router-view v-else />
  </div>
</template>

<script setup>
  import { onMounted } from 'vue';
  import { useAuthStore } from '@/stores/auth';

  const authStore = useAuthStore();

  onMounted(async () => {
    // Inicializar autenticación al montar la app
    await authStore.initializeAuth();
  });
</script>
