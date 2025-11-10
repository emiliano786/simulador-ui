<template>
  <header
    class="flex items-center justify-between pl-4 pr-6 py-3 bg-white/90 dark:bg-socrates-card-dark transition-colors shadow-lg"
  >
    <!-- Logo y nombre -->
    <div class="flex items-center gap-3">
      <img src="/src/assets/logos/exos_isotipo.png" alt="Prosa Isotipo" class="w-9 h-9" />
      <span class="text-xl title-1 text-primary dark:text-white tracking-wide">
        {{ $t('header.title') }}
      </span>
    </div>
    <!-- Acciones -->
    <div class="flex items-center gap-4">
      <!-- Botón modo claro/oscuro -->
      <button
        @click="toggleDarkMode"
        class="h-8 w-8 rounded-full bg-neutral-white dark:bg-socrates-sidebar-dark/50 shadow-md shadow-primary-3 dark:shadow-slate-500 flex items-center justify-center font-bold text-primary"
      >
        <e-icon name="dark_mode" size="xs" color="text-slate-500" v-if="isDark" />
        <e-icon name="light_mode" size="xs" color="text-primary" v-else />
      </button>
      <!-- Notificaciones -->
      <!-- <div class="flex items-center gap-2 cursor-pointer">
        <div
          class="h-8 w-8 rounded-full bg-neutral-white dark:bg-socrates-sidebar-dark/50 shadow-md flex items-center justify-center font-bold text-primary dark:text-gray-300"
        >
          <e-icon name="notifications" size="xs" />
        </div>
      </div> -->
    </div>
  </header>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue';

  const isDark = ref(false);

  function toggleDarkMode() {
    document.documentElement.classList.toggle('dark');
    isDark.value = document.documentElement.classList.contains('dark');
  }

  onMounted(() => {
    isDark.value =
      document.documentElement.classList.contains('dark') ||
      document.documentElement.classList.contains('exos-dark');
  });
</script>

<style scoped>
  /* Puedes agregar estilos adicionales aquí si lo deseas */
</style>
