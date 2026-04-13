<template>
  <div
    class="flex h-screen w-screen overflow-hidden bg-[#f8fafc] dark:bg-[#000000] transition-colors duration-300"
  >

      <main class="flex-1 overflow-auto p-10 custom-scrollbar">
        <div class="max-w-7xl mx-auto">
          <router-view />
        </div>
      </main>
  </div>
</template>



