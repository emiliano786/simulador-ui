<template>
  <div class="max-w-7xl mx-auto p-6 space-y-6 relative">
    <div
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-[#111827] p-6 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm"
    >
      <div>
        <h1
          class="text-xl font-bold text-gray-900 dark:text-white tracking-tight"
        >
          Plantillas Guardadas
        </h1>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Administra las configuraciones predefinidas del simulador
        </p>
      </div>

      <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <div class="relative w-full sm:w-64">
          <span
            class="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-sm"
            >search</span
          >
          <input
            v-model="search"
            type="text"
            placeholder="Buscar plantilla o MTI..."
            class="w-full pl-9 pr-4 py-2 text-xs font-mono rounded-lg border bg-gray-50 dark:bg-black text-gray-800 dark:text-white outline-none border-gray-200 dark:border-slate-700 focus:border-cyan-500 transition-colors"
          />
        </div>
      </div>
    </div>

    <div
      class="bg-white dark:bg-[#111827] border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden"
    >
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr
              class="bg-gray-50 dark:bg-[#0d1421] text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-slate-800"
            >
              <th class="px-6 py-4">Nombre de Plantilla</th>
              <th class="px-6 py-4 text-center">MTI</th>
              <th class="px-6 py-4 text-center">Lote (Batch)</th>
              <th class="px-6 py-4 text-center">Retraso (ms)</th>
              <th v-if="isAdmin" class="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody
            class="text-xs font-mono text-gray-700 dark:text-gray-300 divide-y divide-gray-100 dark:divide-slate-800/50"
          >
            <tr v-if="isLoading" class="animate-pulse">
              <td colspan="5" class="px-6 py-8 text-center text-gray-400">
                Cargando plantillas...
              </td>
            </tr>

            <tr v-else-if="filteredConfigs.length === 0">
              <td colspan="5" class="px-6 py-12 text-center">
                <span
                  class="material-symbols-outlined text-4xl text-gray-300 dark:text-slate-700 block mb-2"
                  >folder_off</span
                >
                <span class="text-gray-400 font-sans text-sm"
                  >No se encontraron plantillas guardadas</span
                >
              </td>
            </tr>

            <tr
              v-for="config in paginatedConfigs"
              :key="config.name"
              class="hover:bg-gray-50/50 dark:hover:bg-slate-800/20 transition-colors"
            >
              <td class="px-6 py-4">
                <span
                  @click="
                    router.push({
                      name: 'template-detail',
                      params: { name: config.name },
                    })
                  "
                  class="font-bold text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 cursor-pointer hover:underline transition-all"
                  title="Inspeccionar Plantilla"
                >
                  {{ config.name }}
                </span>
              </td>
              <td class="px-6 py-4 text-center">
                <span
                  class="bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 px-2 py-1 rounded text-[10px] font-bold tracking-wider"
                >
                  {{ config.mti }}
                </span>
              </td>
              <td
                class="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
              >
                {{ config.batch_size }} txns
              </td>
              <td
                class="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
              >
                {{ config.delay_ms }} ms
              </td>
              <td v-if="isAdmin" class="px-6 py-4 text-right space-x-3">
                <button
                  @click="
                    router.push({
                      name: 'template-detail',
                      params: { name: config.name },
                    })
                  "
                  class="text-gray-400 hover:text-cyan-500 transition-colors"
                  title="Ver Detalles"
                >
                  <span class="material-symbols-outlined text-lg"
                    >visibility</span
                  >
                </button>
                <button
                  @click="confirmDelete(config)"
                  class="text-gray-400 hover:text-red-500 transition-colors"
                  title="Eliminar"
                >
                  <span class="material-symbols-outlined text-lg">delete</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div
        v-if="filteredConfigs.length > 0"
        class="px-6 py-4 border-t border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/30 flex items-center justify-between"
      >
        <span
          class="text-[10px] font-bold uppercase tracking-widest text-gray-500"
        >
          Página {{ currentPage }} de {{ totalPages }}
          <span class="ml-2 font-normal lowercase tracking-normal opacity-70">
            ({{ filteredConfigs.length }} plantillas en total)
          </span>
        </span>

        <div class="flex gap-2">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-black text-[10px] font-bold uppercase tracking-widest text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <span class="material-symbols-outlined text-[14px]"
              >chevron_left</span
            >
            Anterior
          </button>

          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-black text-[10px] font-bold uppercase tracking-widest text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Siguiente
            <span class="material-symbols-outlined text-[14px]"
              >chevron_right</span
            >
          </button>
        </div>
      </div>
    </div>

    <transition name="fade">
      <div
        v-if="showViewModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      >
        <div
          class="bg-white dark:bg-[#111827] w-full max-w-lg rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
        >
          <div
            class="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-900/30"
          >
            <h2
              class="text-sm font-bold uppercase tracking-widest text-gray-800 dark:text-gray-200"
            >
              Detalles de Plantilla
            </h2>
            <button
              @click="showViewModal = false"
              class="text-gray-400 hover:text-red-500 transition-colors"
            >
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <div class="p-6 overflow-y-auto custom-scrollbar space-y-4">
            <div>
              <label
                class="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1"
                >Nombre</label
              >
              <div
                class="w-full text-xs font-mono px-3 py-2.5 rounded-lg border bg-gray-50 dark:bg-black text-gray-800 dark:text-white border-gray-200 dark:border-slate-700"
              >
                {{ selectedConfig?.name }}
              </div>
            </div>

            <div>
              <label
                class="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1"
                >Campos Configurados</label
              >
              <div
                class="w-full text-xs font-mono px-3 py-2.5 rounded-lg border bg-gray-50 dark:bg-black text-gray-800 dark:text-white border-gray-200 dark:border-slate-700 max-h-40 overflow-y-auto custom-scrollbar"
              >
                <pre class="whitespace-pre-wrap">{{
                  JSON.stringify(selectedConfig?.fields, null, 2)
                }}</pre>
              </div>
            </div>
          </div>

          <div
            class="px-6 py-4 border-t border-gray-100 dark:border-slate-800 flex justify-end bg-gray-50/50 dark:bg-slate-900/30"
          >
            <button
              type="button"
              @click="showViewModal = false"
              class="px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest text-white bg-cyan-500 hover:bg-cyan-600 transition-colors shadow-md"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </transition>

    <transition name="fade">
      <div
        v-if="showDeleteModal"
        class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      >
        <div
          class="bg-white dark:bg-[#111827] w-full max-w-sm rounded-3xl shadow-2xl border border-gray-200 dark:border-slate-800 overflow-hidden transform transition-all"
        >
          <div class="flex flex-col items-center justify-center py-8 px-6">
            <div
              class="mb-6 w-20 h-20 bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center"
            >
              <span class="material-symbols-outlined text-4xl text-red-500"
                >warning</span
              >
            </div>
            <h3
              class="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center"
            >
              ¿Eliminar Plantilla?
            </h3>
            <p
              class="text-xs text-gray-500 dark:text-gray-400 text-center mb-8 leading-relaxed"
            >
              Estás a punto de eliminar la plantilla
              <span class="font-bold text-gray-700 dark:text-gray-200">{{
                configToDelete?.name
              }}</span
              >.
            </p>
            <div class="flex gap-3 w-full">
              <button
                @click="showDeleteModal = false"
                class="flex-1 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300 text-xs font-bold uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                @click="executeDelete"
                :disabled="isDeleting"
                class="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-red-500/30 flex justify-center items-center gap-2"
              >
                <span
                  v-if="isDeleting"
                  class="animate-spin border-2 border-white/30 border-t-white rounded-full w-4 h-4"
                ></span>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <transition name="toast-drop">
      <div
        v-if="toast.show"
        class="fixed top-8 left-1/2 z-[9999] flex items-center gap-4 w-[90vw] max-w-xl px-6 py-4 rounded-xl shadow-[0_15px_40px_-10px_rgba(0,0,0,0.5)] border transition-all"
        :class="
          toast.type === 'error'
            ? 'bg-red-50 border-red-200 border-l-[8px] border-l-red-500 text-red-700 dark:bg-[#2c1015] dark:border-red-900/50 dark:border-l-red-600 dark:text-red-400'
            : 'bg-emerald-50 border-emerald-200 border-l-[8px] border-l-emerald-500 text-emerald-700 dark:bg-[#122e20] dark:border-emerald-900/50 dark:border-l-emerald-600 dark:text-emerald-400'
        "
      >
        <span class="material-symbols-outlined text-4xl shrink-0">{{
          toast.type === "error" ? "error" : "check_circle"
        }}</span>
        <div class="flex-1 space-y-1 pr-4">
          <p class="text-[9px] font-black uppercase tracking-widest opacity-60">
            Notificación del Sistema
          </p>
          <p
            class="text-xs font-bold uppercase tracking-widest whitespace-pre-wrap leading-relaxed"
          >
            {{ toast.message }}
          </p>
        </div>
        <button
          @click="toast.show = false"
          class="absolute top-3 right-3 opacity-50 hover:opacity-100 transition-opacity"
        >
          <span class="material-symbols-outlined text-lg">close</span>
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();
const configs = ref([]);
const search = ref("");
const isLoading = ref(true);

// --- ESTADO MODAL VER ---
const showViewModal = ref(false);
const selectedConfig = ref(null);

// --- ESTADO MODAL ELIMINAR ---
const showDeleteModal = ref(false);
const configToDelete = ref(null);
const isDeleting = ref(false);

// --- ESTADO TOAST ---
const toast = ref({ show: false, message: "", type: "error" });
let toastTimeout = null;

function showToast(message, type = "error") {
  toast.value = { show: true, message, type };
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => (toast.value.show = false), 5000);
}

// --- VERIFICAR ROL ---
const isAdmin = computed(() => {
  const storedUser = localStorage.getItem("iso_user");
  if (storedUser) {
    try {
      const parsed = JSON.parse(storedUser);
      const safeRole = (parsed.role || "").toLowerCase().trim();
      return safeRole === "admin";
    } catch (e) {
      return false;
    }
  }
  return false;
});

// --- OBTENER PLANTILLAS ---
const fetchConfigs = async () => {
  isLoading.value = true;
  try {
    const token = localStorage.getItem("iso_token");
    const { data } = await axios.get("http://localhost:8080/api/configs", {
      headers: { Authorization: `Bearer ${token}` },
    });
    configs.value = data.configs || [];
  } catch (error) {
    showToast(
      error.response?.data?.detail || "No se pudieron cargar las plantillas.",
      "error",
    );
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => fetchConfigs());

// --- BUSCADOR ---
const filteredConfigs = computed(() => {
  if (!search.value) return configs.value;
  const s = search.value.toLowerCase();
  return configs.value.filter(
    (c) =>
      (c.name && c.name.toLowerCase().includes(s)) ||
      (c.mti && c.mti.toLowerCase().includes(s)),
  );
});

const currentPage = ref(1);
const itemsPerPage = 10;

watch(search, () => {
  currentPage.value = 1;
});

const totalPages = computed(() => {
  return Math.ceil(filteredConfigs.value.length / itemsPerPage) || 1;
});

watch(totalPages, (newTotal) => {
  if (currentPage.value > newTotal) {
    currentPage.value = newTotal;
  }
});

const paginatedConfigs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredConfigs.value.slice(start, end);
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

// --- LÓGICA VER ---
const openViewModal = (config) => {
  selectedConfig.value = config;
  showViewModal.value = true;
};

// --- LÓGICA ELIMINAR ---
const confirmDelete = (config) => {
  configToDelete.value = config;
  showDeleteModal.value = true;
};

const executeDelete = async () => {
  isDeleting.value = true;
  try {
    const token = localStorage.getItem("iso_token");
    const encodedName = encodeURIComponent(configToDelete.value.name);

    await axios.delete(`http://localhost:8080/api/configs/${encodedName}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    showToast("Plantilla eliminada correctamente.", "success");
    showDeleteModal.value = false;
    fetchConfigs();
  } catch (err) {
    showToast(
      err.response?.data?.detail || "No se pudo eliminar la plantilla.",
      "error",
    );
  } finally {
    isDeleting.value = false;
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.toast-drop-enter-active,
.toast-drop-leave-active {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.toast-drop-enter-from,
.toast-drop-leave-to {
  opacity: 0;
  transform: translate(-50%, -50px);
}
.toast-drop-enter-to,
.toast-drop-leave-from {
  opacity: 1;
  transform: translate(-50%, 0);
}
</style>
