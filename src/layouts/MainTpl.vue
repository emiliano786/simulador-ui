<template>
  <div
    class="flex h-screen w-screen overflow-hidden bg-[#f8fafc] dark:bg-[#000000] transition-colors duration-300"
  >
    <ESidebar class="flex-none" />

    <div class="flex-1 flex flex-col min-w-0 ml-72 overflow-hidden">
      <main class="flex-1 overflow-auto p-10 custom-scrollbar">
        <div class="max-w-7xl mx-auto">
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import ESidebar from "@/components/sections/ESidebar.vue";
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #1e293b;
}
</style>
