<template>
  <div class="max-w-7xl mx-auto p-6 space-y-6">
    <div
      class="flex items-center gap-4 bg-white dark:bg-[#111827] p-6 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm"
    >
      <button
        @click="goBack"
        class="p-2 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
      >
        <span class="material-symbols-outlined">arrow_back</span>
      </button>
      <div>
        <h1
          class="text-xl font-bold text-gray-900 dark:text-white tracking-tight"
        >
          {{ isLoading ? "Cargando..." : config?.name }}
        </h1>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Detalles y campos de la plantilla
        </p>
      </div>
    </div>

    <div v-if="isLoading" class="text-center py-12 text-gray-400 animate-pulse">
      Cargando información...
    </div>

    <div v-else-if="config" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="space-y-6">
        <div
          class="bg-white dark:bg-[#111827] p-6 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm"
        >
          <h2
            class="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4"
          >
            Información General
          </h2>
          <ul class="space-y-4 text-sm font-mono">
            <li
              class="flex justify-between items-center border-b border-gray-100 dark:border-slate-800 pb-2"
            >
              <span class="text-gray-500">MTI:</span>
              <span class="font-bold text-indigo-500">{{
                config.mti || "N/A"
              }}</span>
            </li>
            <li
              class="flex justify-between items-center border-b border-gray-100 dark:border-slate-800 pb-2"
            >
              <span class="text-gray-500">Lote (Batch):</span>
              <span class="text-gray-800 dark:text-gray-200">{{
                config.batch_size || 1
              }}</span>
            </li>
            <li
              class="flex justify-between items-center border-b border-gray-100 dark:border-slate-800 pb-2"
            >
              <span class="text-gray-500">Retraso (ms):</span>
              <span class="text-gray-800 dark:text-gray-200">{{
                config.delay_ms || 0
              }}</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="lg:col-span-2 space-y-6">
        <div
          v-if="config.raw_string || config.message || config.raw_message"
          class="bg-white dark:bg-[#111827] rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden"
        >
          <div
            class="px-6 py-4 border-b border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-[#0d1421] flex justify-between items-center"
          >
            <h2
              class="text-xs font-bold uppercase tracking-widest text-gray-500"
            >
              Trama ISO8583 Almacenada (Raw Message)
            </h2>
            <span
              class="bg-cyan-500/10 text-cyan-500 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border border-cyan-500/20"
              >Raw String</span
            >
          </div>
          <div class="p-6 bg-gray-50/50 dark:bg-black/40">
            <div
              class="w-full text-xs font-mono p-4 rounded-xl border bg-gray-50 dark:bg-black text-gray-800 dark:text-emerald-400 border-gray-200 dark:border-slate-800 break-all leading-relaxed tracking-wider shadow-inner"
            >
              {{ config.raw_string }}
            </div>
          </div>
        </div>

        <div
          class="bg-white dark:bg-[#111827] rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden p-6 transition-all"
        >
          <div
            class="flex justify-between items-center mb-6 border-b border-gray-100 dark:border-slate-800 pb-4"
          >
            <h3
              class="text-xs font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2"
            >
              <span class="material-symbols-outlined text-lg">grid_view</span>
              Mapa de Campos Guardados
            </h3>
            <span
              class="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/30 px-2 py-1 rounded"
            >
              {{ allActiveFields.length }} Activos
            </span>
          </div>

          <div v-if="allActiveFields.length === 0" class="text-center py-8">
            <span
              class="material-symbols-outlined text-4xl text-gray-300 dark:text-slate-700 block mb-2"
              >data_object</span
            >
            <span class="text-gray-400/70 font-sans text-xs italic"
              >Esta plantilla no contiene campos mapeados.</span
            >
          </div>

          <div v-else class="flex flex-col gap-6">
            <div class="flex flex-wrap gap-2">
              <button
                v-for="id in allActiveFields"
                :key="id"
                @click="selectedField = selectedField === id ? null : id"
                class="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-mono font-bold transition-all duration-200 border-2"
                :class="getButtonClass(id)"
              >
                {{ id }}
              </button>
            </div>

            <div class="h-4 flex items-center justify-center">
              <p
                v-if="!selectedField"
                class="text-[9px] font-bold uppercase tracking-widest text-gray-400 animate-pulse"
              >
                Haz clic en un campo para ver su valor
              </p>
            </div>

            <transition name="slide-down">
              <div
                v-if="selectedField"
                class="rounded-2xl border-2 shadow-xl overflow-hidden relative"
                :class="
                  isSynthetic(selectedField)
                    ? 'border-purple-300 dark:border-purple-700 bg-white dark:bg-[#111827]'
                    : 'border-cyan-300 dark:border-cyan-700 bg-white dark:bg-[#111827]'
                "
              >
                <button
                  @click="selectedField = null"
                  class="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                >
                  <span class="material-symbols-outlined text-lg">close</span>
                </button>

                <div
                  class="p-5 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50 flex items-center gap-3"
                >
                  <span
                    class="text-lg font-black font-mono w-10"
                    :class="
                      isSynthetic(selectedField)
                        ? 'text-purple-600 dark:text-purple-400'
                        : 'text-cyan-600 dark:text-cyan-400'
                    "
                  >
                    F{{ selectedField }}
                  </span>
                  <span
                    class="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded shadow-sm"
                    :class="
                      isSynthetic(selectedField)
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                        : 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400'
                    "
                  >
                    {{
                      isSynthetic(selectedField)
                        ? "Dato Sintético"
                        : "Dato Estático"
                    }}
                  </span>
                </div>

                <div class="p-6">
                  <div v-if="!isSynthetic(selectedField)">
                    <label
                      class="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2"
                      >Valor Fijo Guardado</label
                    >
                    <div
                      class="w-full font-mono text-sm px-4 py-4 rounded-xl border-2 border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-black text-gray-800 dark:text-gray-100 break-all shadow-inner"
                    >
                      {{ getFieldValue(selectedField) || "Vacío" }}
                    </div>
                  </div>

                  <div v-else>
                    <label
                      class="text-[10px] font-bold text-purple-500 uppercase tracking-widest block mb-3"
                    >
                      Configuración Dinámica (Sintético)
                    </label>

                    <div
                      v-if="getSyntheticData(selectedField)?.min !== undefined"
                      class="flex flex-wrap gap-4"
                    >
                      <div
                        class="flex-1 min-w-[80px] bg-purple-50/50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800/50 rounded-xl p-3 shadow-inner"
                      >
                        <span
                          class="text-[9px] font-bold text-purple-400 uppercase tracking-widest block mb-1"
                          >Mínimo</span
                        >
                        <span
                          class="font-mono text-purple-700 dark:text-purple-300 font-bold text-sm"
                          >{{ getSyntheticData(selectedField).min }}</span
                        >
                      </div>
                      <div
                        class="flex-1 min-w-[80px] bg-purple-50/50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800/50 rounded-xl p-3 shadow-inner"
                      >
                        <span
                          class="text-[9px] font-bold text-purple-400 uppercase tracking-widest block mb-1"
                          >Máximo</span
                        >
                        <span
                          class="font-mono text-purple-700 dark:text-purple-300 font-bold text-sm"
                          >{{ getSyntheticData(selectedField).max }}</span
                        >
                      </div>
                      <div
                        class="flex-1 min-w-[80px] bg-purple-50/50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800/50 rounded-xl p-3 shadow-inner"
                      >
                        <span
                          class="text-[9px] font-bold text-purple-400 uppercase tracking-widest block mb-1"
                          >Modo</span
                        >
                        <span
                          class="font-mono text-purple-700 dark:text-purple-300 font-bold text-sm uppercase"
                          >{{
                            getSyntheticData(selectedField).mode || "RANDOM"
                          }}</span
                        >
                      </div>
                    </div>

                    <div
                      v-else-if="getSyntheticData(selectedField)?.valueList"
                      class="bg-purple-50/50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800/50 rounded-xl p-4 shadow-inner"
                    >
                      <span
                        class="text-[9px] font-bold text-purple-400 uppercase tracking-widest block mb-3"
                        >Pool de Valores (Value List)</span
                      >
                      <div class="flex flex-wrap gap-2">
                        <span
                          v-for="(val, idx) in getSyntheticData(selectedField)
                            .valueList"
                          :key="idx"
                          class="px-2.5 py-1 bg-white dark:bg-black border border-purple-300 dark:border-purple-700 rounded-lg font-mono text-xs text-purple-700 dark:text-purple-300 font-bold shadow-sm"
                        >
                          {{ val }}
                        </span>
                      </div>
                    </div>

                    <div
                      v-else
                      class="text-xs font-mono text-purple-400/70 dark:text-purple-500/50 italic px-4 py-3 border border-dashed border-purple-300 dark:border-purple-800 rounded-xl"
                    >
                      Dato sintético automático sin parámetros extra.
                    </div>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

const route = useRoute();
const router = useRouter();
const config = ref(null);
const isLoading = ref(true);

onMounted(async () => {
  const templateName = route.params.name;
  if (!templateName) return goBack();

  try {
    const token = localStorage.getItem("iso_token");
    const { data } = await axios.get(
      `http://localhost:8080/api/configs/${encodeURIComponent(templateName)}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    config.value = data.data;
  } catch (error) {
    console.error("Error al cargar la plantilla:", error);
    alert("No se pudo cargar la plantilla.");
    goBack();
  } finally {
    isLoading.value = false;
  }
});

const selectedField = ref(null);

const allActiveFields = computed(() => {
  if (!config.value) return [];
  const staticKeys = Object.keys(config.value.fields || {}).map((k) =>
    k.replace("F", ""),
  );
  const synthKeys = Object.keys(config.value.synthetic_config || {}).map((k) =>
    k.replace("F", ""),
  );

  const combined = [...new Set([...staticKeys, ...synthKeys])].map(Number);
  return combined.sort((a, b) => a - b);
});

const isSynthetic = (id) => {
  if (!config.value) return false;
  const isInArray =
    config.value.synthetic_fields?.includes(String(id)) ||
    config.value.synthetic_fields?.includes(`F${id}`);
  const hasConfig =
    config.value.synthetic_config &&
    (config.value.synthetic_config[`F${id}`] ||
      config.value.synthetic_config[`${id}`]);
  return isInArray || !!hasConfig;
};

const getFieldValue = (id) => {
  if (!config.value || !config.value.fields) return null;
  const val = config.value.fields[`F${id}`] ?? config.value.fields[`${id}`];
  return val === "" || val === null ? null : val;
};

const getSyntheticData = (id) => {
  if (!config.value || !config.value.synthetic_config) return null;
  return (
    config.value.synthetic_config[`F${id}`] ||
    config.value.synthetic_config[`${id}`]
  );
};

const getButtonClass = (id) => {
  const isSynth = isSynthetic(id);
  const isSelected = selectedField.value === id;

  if (isSelected) {
    return isSynth
      ? "bg-purple-500 border-purple-500 text-white shadow-[0_4px_12px_rgba(168,85,247,0.4)] scale-110 z-10 ring-2 ring-purple-200 dark:ring-purple-900"
      : "bg-cyan-500 border-cyan-500 text-white shadow-[0_4px_12px_rgba(6,182,212,0.4)] scale-110 z-10 ring-2 ring-cyan-200 dark:ring-cyan-900";
  } else {
    return isSynth
      ? "bg-purple-100 border-purple-400 text-purple-800 dark:bg-purple-900/60 dark:border-purple-600 dark:text-purple-300 hover:bg-purple-200 hover:border-purple-500"
      : "bg-cyan-50 border-cyan-300 text-cyan-700 dark:bg-cyan-900/40 dark:border-cyan-700 dark:text-cyan-300 hover:bg-cyan-100";
  }
};

const goBack = () => router.push({ name: "template-form" });
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
  max-height: 0;
}
.slide-down-enter-to,
.slide-down-leave-from {
  opacity: 1;
  transform: translateY(0);
  max-height: 800px;
}
</style>
