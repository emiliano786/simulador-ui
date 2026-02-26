<template>
  <aside
    class="w-72 h-screen bg-white dark:bg-[#0f172a] border-r border-gray-100 dark:border-slate-800 flex flex-col py-8 transition-all duration-300 fixed left-0 top-0 z-50"
  >
    <div class="px-8 mb-10 flex items-center gap-3">
      <img
        src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6993a9d25621111e317c75ad/2c74f7dc1_exos_gmail_logo_square.png"
        alt="Exos"
        class="h-8 w-8 object-contain rounded-lg shadow-sm"
      />
      <div class="flex flex-col leading-none">
        <span
          class="text-xl font-bold tracking-tighter text-gray-900 dark:text-white"
          >exos</span
        >
        <span
          class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]"
          >Simulador</span
        >
      </div>
    </div>

    <div
      class="mx-6 mb-10 p-4 bg-[#f8fafc] dark:bg-slate-800/40 rounded-2xl flex items-center gap-4 border border-gray-100 dark:border-slate-700"
    >
      <div
        class="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center font-bold text-[#8b5cf6] dark:text-purple-400"
      >
        {{ userInitials }}
      </div>
      <div class="flex flex-col">
        <span
          class="text-sm font-bold text-gray-800 dark:text-gray-100 leading-tight"
        >
          {{ currentUser?.name || "Usuario" }}
        </span>
        <span
          class="text-[10px] text-gray-400 font-bold uppercase tracking-widest"
        >
          {{ currentUser?.profileName || "Usuario" }}
        </span>
      </div>
    </div>

    <nav class="flex-1 px-4 space-y-2">
      <div
        v-for="mod in accessibleModules"
        :key="mod.route"
        @click="navigateTo(mod.route)"
        :class="[
          'flex items-center justify-between px-4 py-3 rounded-xl transition-all cursor-pointer font-semibold text-sm group',
          $route.name === mod.route
            ? 'bg-purple-50 dark:bg-purple-900/20 text-[#8b5cf6] dark:text-purple-400 border-r-4 border-[#8b5cf6]'
            : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800',
        ]"
      >
        <div class="flex items-center gap-4">
          <span
            class="material-symbols-outlined text-[22px]"
            :class="
              $route.name === mod.route
                ? 'text-[#8b5cf6]'
                : 'text-gray-400 group-hover:text-gray-600'
            "
          >
            {{ mod.icon }}
          </span>
          <span>{{ $t(mod.label) }}</span>
        </div>
        <span
          v-if="$route.name === mod.route"
          class="material-symbols-outlined text-sm"
          >chevron_right</span
        >
      </div>
    </nav>

    <div
      class="px-6 pt-6 border-t border-gray-50 dark:border-slate-800 space-y-4"
    >
      <div
        @click="toggleDarkMode"
        class="flex items-center gap-4 px-4 py-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer text-sm font-semibold transition-colors"
      >
        <span class="material-symbols-outlined">{{
          isDark ? "light_mode" : "dark_mode"
        }}</span>
        <span>{{ isDark ? "Modo claro" : "Modo oscuro" }}</span>
      </div>
      <div
        @click="logout"
        class="flex items-center gap-4 px-4 py-2 text-gray-400 hover:text-red-500 cursor-pointer text-sm font-semibold transition-colors"
      >
        <span class="material-symbols-outlined">logout</span>
        <span>Cerrar Sesión</span>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const $route = useRoute();
const authStore = useAuthStore();

const isDark = ref(false);

const toggleDarkMode = () => {
  isDark.value = !isDark.value;
  if (isDark.value) {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
};

onMounted(() => {
  const savedTheme = localStorage.getItem("theme");
  if (
    savedTheme === "dark" ||
    (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    isDark.value = true;
    document.documentElement.classList.add("dark");
  }
});

const currentUser = computed(() => authStore.getCurrentUser());
const userInitials = computed(() => {
  if (!currentUser.value) return "U";
  const { name, lastname } = currentUser.value;
  return `${name?.charAt(0) || ""}${lastname?.charAt(0) || ""}`.toUpperCase();
});

const navigateTo = (path) => {
  router.push(path);
};
const logout = () => authStore.logout();

const accessibleModules = computed(() => [
  {
    moduleKey: "monitoring",
    route: "/simulator", // Este es el nombre de la ruta en tu router
    icon: "monitor_heart",
    label: "Simulador",
    requiredAction: "list",
  },
]);
</script>
