<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#050505] p-4 relative transition-colors duration-300">
    
    <button 
      @click="toggleDarkMode" 
      class="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-[#111827] border border-gray-200 dark:border-slate-800 shadow-sm text-gray-500 dark:text-gray-400 hover:text-cyan-500 dark:hover:text-cyan-400 transition-all hover:scale-105"
      :title="isDark ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'"
    >
      <span class="material-symbols-outlined text-xl transition-transform duration-500" :class="isDark ? 'rotate-0' : '-rotate-90'">
        {{ isDark ? 'light_mode' : 'dark_mode' }}
      </span>
    </button>

    <div class="w-full max-w-md bg-white dark:bg-[#111827] border border-gray-200 dark:border-slate-800 rounded-3xl shadow-2xl p-8 transition-colors duration-300">
      
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-cyan-500/10 text-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="material-symbols-outlined text-3xl">lock</span>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Iniciar Sesión</h1>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">Acceso al Simulador ISO8583</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-5">
        <div>
          <label class="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">Usuario</label>
          <input 
            v-model="form.user" 
            type="text" 
            required
            class="w-full text-sm font-mono px-4 py-3 rounded-xl border bg-gray-50 dark:bg-black text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-cyan-500 border-gray-200 dark:border-slate-700 transition-all"
            placeholder="ej. admin_prosa"
          />
        </div>

        <div>
          <label class="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">Contraseña</label>
          <input 
            v-model="form.password" 
            type="password" 
            required
            class="w-full text-sm px-4 py-3 rounded-xl border bg-gray-50 dark:bg-black text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-cyan-500 border-gray-200 dark:border-slate-700 transition-all"
            placeholder="••••••••"
          />
        </div>

        <button 
          type="submit" 
          :disabled="isLoading"
          class="w-full py-4 mt-4 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-cyan-500/30 flex justify-center items-center gap-2 disabled:opacity-50"
        >
          <span v-if="isLoading" class="animate-spin border-2 border-white/30 border-t-white rounded-full w-4 h-4"></span>
          {{ isLoading ? 'Autenticando...' : 'Ingresar' }}
        </button>

        <p v-if="errorMsg" class="text-center text-xs font-bold text-red-500 mt-4">{{ errorMsg }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const form = ref({ user: '', password: '' });
const isLoading = ref(false);
const errorMsg = ref('');

// --- LÓGICA DEL MODO OSCURO ---
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
  if (savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
    isDark.value = true;
    document.documentElement.classList.add("dark");
  } else {
    isDark.value = false;
    document.documentElement.classList.remove("dark");
  }
});

// --- LÓGICA DE LOGIN ---
const handleLogin = async () => {
  isLoading.value = true;
  errorMsg.value = '';
  try {
    const { data } = await axios.post('http://localhost:8080/api/auth/login', form.value);
    
    localStorage.setItem('iso_token', data.data.token);
    localStorage.setItem('iso_user', JSON.stringify(data.data));
    
    router.push({ name: 'simulator-form' });
  } catch (err) {
    errorMsg.value = err.response?.data?.detail || "Error al conectar con el servidor.";
  } finally {
    isLoading.value = false;
  }
};
</script>