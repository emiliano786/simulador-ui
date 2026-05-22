<template>
  <div
    class="flex flex-col h-screen w-screen overflow-hidden bg-[#f7f8fa] dark:bg-[#050505] p-4 transition-colors duration-300"
  >
    
    <div class="flex xs:flex-col lg:flex-row flex-1 min-h-0 gap-4">
      
      <Sidebar class="flex-none rounded-2xl overflow-hidden shadow-sm border border-gray-200 dark:border-slate-800" />

      <main
        class="flex-1 overflow-auto bg-white dark:bg-[#0d1421] rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 custom-scrollbar relative"
      >
        <div class="p-6 min-h-full max-w-7xl mx-auto">
          <router-view />
        </div>
      </main>

    </div>

  </div>
</template>

<script setup>
import Sidebar from '@/components/sections/ESidebar.vue';
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.3);
  border-radius: 20px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(71, 85, 105, 0.5);
}
</style>