<template>
  <aside class="flex flex-col h-full shrink-0 shadow-lg relative z-20">
    <div
      class="flex lg:hidden w-full items-center bg-[#111827] shadow-md px-4 py-3 gap-4"
    >
      <div class="flex items-center gap-3 min-w-max">
        <div
          class="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white shadow-sm text-sm"
        >
          {{ userInitials }}
        </div>
        <div class="flex flex-col">
          <span class="font-bold text-white text-xs leading-tight">
            {{ currentUser.name }}
          </span>
          <span
            class="text-cyan-400 text-[10px] uppercase tracking-widest leading-tight"
          >
            {{ currentUser.role }}
          </span>
        </div>
      </div>

      <nav
        class="flex-1 flex overflow-x-auto gap-2 px-2 scrollbar-thin scrollbar-thumb-cyan-500/40 scrollbar-track-transparent"
      >
        <div
          v-for="mod in modules"
          :key="mod.route"
          @click="navigateTo(mod.route)"
          :class="[
            'flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer transition-all duration-200 min-w-max',
            $route.name === mod.route
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-inner'
              : 'text-gray-400 hover:text-white hover:bg-white/5',
          ]"
        >
          <span class="material-symbols-outlined text-sm">{{ mod.icon }}</span>
          <span
            v-if="$route.name === mod.route"
            class="text-xs font-bold uppercase tracking-widest"
            >{{ mod.label }}</span
          >
        </div>
      </nav>

      <div
        class="flex items-center min-w-max p-2 text-gray-400 hover:text-red-400 cursor-pointer transition-colors"
        @click="logout"
      >
        <span class="material-symbols-outlined text-xl">logout</span>
      </div>
    </div>

    <div
      class="hidden lg:flex h-full w-[240px] bg-white dark:bg-[#111827] flex-col justify-between pt-8 pb-6"
    >
      <div class="flex flex-col gap-6">
        <div class="flex items-center gap-4 px-6 cursor-default">
          <div
            class="h-12 w-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-cyan-500/30 text-lg"
          >
            {{ userInitials }}
          </div>
          <div class="flex flex-col overflow-hidden">
            <span
              class="font-bold text-gray-900 dark:text-white truncate"
              :title="currentUser.name"
            >
              {{ currentUser.name }}
            </span>
            <span
              class="text-cyan-600 dark:text-cyan-400 text-[10px] font-bold uppercase tracking-widest mt-0.5 truncate"
            >
              {{ currentUser.role }}
            </span>
          </div>
        </div>

        <hr class="border-gray-100 dark:border-slate-800 mx-4" />

        <nav class="flex flex-col gap-2 px-4">
          <p
            class="px-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1"
          >
            Módulos
          </p>

          <div
            v-for="mod in modules"
            :key="mod.route"
            @click="navigateTo(mod.route)"
            :class="[
              'flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200',
              $route.name === mod.route
                ? 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-100 dark:border-cyan-500/20 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white',
            ]"
          >
            <span class="material-symbols-outlined text-[18px]">{{
              mod.icon
            }}</span>
            <span class="text-xs font-bold uppercase tracking-widest">{{
              mod.label
            }}</span>
          </div>
        </nav>
      </div>

      <div class="px-4 flex flex-col gap-3">
        <div
          class="flex items-center bg-gray-100 dark:bg-black/50 p-1 rounded-xl border border-gray-200/50 dark:border-slate-800/50 shadow-inner"
        >
          <button
            @click="isDark && toggleDarkMode()"
            class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all duration-300"
            :class="
              !isDark
                ? 'bg-white text-cyan-600 shadow-sm border border-gray-200/50'
                : 'text-gray-400 hover:text-gray-600'
            "
          >
            <span class="material-symbols-outlined text-[16px]"
              >light_mode</span
            >
            <span class="text-[9px] font-black uppercase tracking-widest"
              >Claro</span
            >
          </button>

          <button
            @click="!isDark && toggleDarkMode()"
            class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all duration-300"
            :class="
              isDark
                ? 'bg-[#1e293b] text-cyan-400 shadow-sm border border-slate-700/50'
                : 'text-gray-500 hover:text-gray-400'
            "
          >
            <span class="material-symbols-outlined text-[16px]">dark_mode</span>
            <span class="text-[9px] font-black uppercase tracking-widest"
              >Oscuro</span
            >
          </button>
        </div>

        <div
          class="flex items-center justify-center gap-2 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 text-red-500/80 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 hover:border-red-100 dark:hover:border-red-500/20 border border-transparent"
          @click="logout"
        >
          <span class="material-symbols-outlined text-[18px]">logout</span>
          <span class="text-[10px] font-bold uppercase tracking-widest"
            >Cerrar Sesión</span
          >
        </div>
      </div>
    </div>
  </aside>

  <transition name="fade">
    <div
      v-if="showLogoutDialog"
      class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <div
        class="bg-white dark:bg-[#111827] w-full max-w-sm rounded-3xl shadow-2xl border border-gray-200 dark:border-slate-800 overflow-hidden transform transition-all"
      >
        <div class="flex flex-col items-center justify-center py-8 px-6">
          <div class="mb-6">
            <div
              class="w-20 h-20 bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center"
            >
              <span
                class="material-symbols-outlined text-4xl text-red-500 animate-pulse"
                >logout</span
              >
            </div>
          </div>

          <h3
            class="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center"
          >
            ¿Cerrar Sesión?
          </h3>
          <p
            class="text-xs text-gray-500 dark:text-gray-400 text-center mb-8 leading-relaxed"
          >
            Se cerrará la sesión actual y tendrás que volver a ingresar tus
            credenciales para usar el Simulador.
          </p>

          <div class="flex gap-3 w-full">
            <button
              @click="cancelLogout"
              class="flex-1 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300 text-xs font-bold uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              @click="confirmLogout"
              class="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-red-500/30"
            >
              Salir
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import { computed, ref, onMounted } from "vue";

const router = useRouter();
const $route = useRoute();

// --- ESTADO DEL USUARIO ---
const currentUser = ref({ name: "Invitado", role: "Usuario" });

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
  const storedUser = localStorage.getItem("iso_user");
  if (storedUser) {
    try {
      const parsed = JSON.parse(storedUser);
      const safeRole = (parsed.role || "user").toLowerCase().trim();

      currentUser.value = {
        name: parsed.fullname || parsed.user || "Usuario",
        role:
          safeRole === "admin"
            ? "Administrador"
            : safeRole === "viewer"
              ? "Solo Lectura"
              : "Usuario Básico",
        rawRole: safeRole,
      };
    } catch (e) {}
  }
});

const userInitials = computed(() => {
  const name = currentUser.value.name;
  if (!name || name === "Invitado") return "US";
  const parts = name.split(" ");
  if (parts.length >= 2)
    return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
  return name.substring(0, 2).toUpperCase();
});

// --- RUTAS DE NAVEGACIÓN ---
const modules = computed(() => {
  const role = currentUser.value.rawRole;

  const list = [{ route: "simulator-form", icon: "bolt", label: "Simulador" }];

  if (role === "admin" || role === "user") {
    list.push({ route: "user-form", icon: "group", label: "Usuarios" });
  }

  if (role === "admin" || role === "user") {
    list.push({
      route: "template-form",
      icon: "settings",
      label: "Configuraciones",
    });
  }

  return list;
});

const navigateTo = (routeName) => {
  router.push({ name: routeName });
};

// --- LÓGICA DE LOGOUT ---
const showLogoutDialog = ref(false);

const logout = () => {
  showLogoutDialog.value = true;
};

const cancelLogout = () => {
  showLogoutDialog.value = false;
};

const confirmLogout = () => {
  showLogoutDialog.value = false;
  localStorage.removeItem("iso_token");
  localStorage.removeItem("iso_user");
  router.push("/login");
};
</script>

<style scoped>
.scrollbar-thin {
  scrollbar-width: thin;
}
.scrollbar-thumb-cyan-500\/40 {
  scrollbar-color: rgba(6, 182, 212, 0.4) transparent;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
