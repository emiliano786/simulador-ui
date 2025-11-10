<template>
  <div
    class="flex flex-col h-screen w-screen overflow-hidden bg-[#f7f8fa] dark:bg-socrates-main-dark gap-4"
  >
    <!-- Header fijo en la parte superior -->
    <EHeader class="flex-none" />

    <!-- Contenedor principal que ocupa el espacio restante -->
    <div class="flex xs:flex-col lg:flex-row flex-1 min-h-0 gap-4">
      <!-- Sidebar fijo -->
      <ESidebar class="flex-none" />

      <!-- Contenido principal con scroll -->
      <main
        class="flex-1 overflow-auto bg-white dark:bg-socrates-card-dark xs:mx-4 lg:mx-0s lg:mr-4 rounded-l-2xl rounded-2xl shadow-sm shadow-slate-600 dark:shadow-black"
      >
        <div class="p-4 min-h-full">
          <router-view />
        </div>
      </main>
    </div>

    <!-- Footer fijo en la parte inferior -->
    <EFooter class="flex-none" />
  </div>
</template>

<script setup>
  import EFooter from '@/components/sections/EFooter.vue';
  import EHeader from '@/components/sections/EHeader.vue';
  import ESidebar from '@/components/sections/ESidebar.vue';
</script>

<style></style>
