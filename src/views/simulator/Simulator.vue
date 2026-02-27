<template>
  <content-tpl>
    <template #header-left>
      <div class="flex flex-col">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
          {{ t("Simulador") || "Monitoreo de Procesos" }}
        </h1>
        <p class="text-xs text-gray-400 dark:text-gray-500 font-medium">
          Gestión de transacciones ISO8583.
        </p>
      </div>
    </template>

    <template #main-content>
      <div class="max-w-7xl mx-auto space-y-6">
        
        <div class="bg-white dark:bg-[#111827] rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-300">
          <div class="p-6 border-b border-gray-50 dark:border-slate-800 flex justify-between items-center">
            <h2 class="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">
              Configuración de Envío
            </h2>
            <div :class="isSyntheticMode ? 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'"
                 class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors">
              {{ isSyntheticMode ? "Modo Sintético" : "Modo Manual" }}
            </div>
          </div>

          <div class="p-8">
            <div class="mb-8 flex items-center justify-between p-4 bg-gray-50/50 dark:bg-slate-900/50 rounded-xl border border-gray-100 dark:border-slate-800">
              <div class="flex items-center gap-4">
                <div class="relative inline-block w-10 h-5 transition duration-200 ease-in">
                  <input type="checkbox" v-model="isSyntheticMode" id="syntheticToggle"
                         class="peer absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 checked:border-[#8b5cf6] shadow-sm" />
                  <label for="syntheticToggle" class="block overflow-hidden h-5 rounded-full bg-gray-300 dark:bg-slate-700 peer-checked:bg-[#8b5cf6] cursor-pointer"></label>
                </div>
                <label for="syntheticToggle" class="text-sm font-semibold text-gray-700 dark:text-gray-300 cursor-pointer">
                  Habilitar Generación Sintética (XML/CSV)
                </label>
              </div>

              <transition name="fade">
                <div v-if="isSyntheticMode" class="flex items-center gap-3">
                  <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Cantidad:</span>
                  <input type="number" v-model="batchSize" min="1" max="50"
                         class="w-16 p-2 text-sm font-bold bg-white dark:bg-black border border-gray-200 dark:border-slate-700 rounded-lg text-[#8b5cf6] focus:ring-1 focus:ring-purple-500 outline-none" />
                </div>
              </transition>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-6 transition-all duration-300"
                 :class="{ 'opacity-30 pointer-events-none grayscale': isSyntheticMode }">
              <e-input v-model="form.tarjeta" label="Tarjeta" placeholder="PAN" :length="19" class="exos-field" />
              <e-input v-model="form.monto" label="Monto" placeholder="0.00" type="number" class="exos-field" />
              <e-input v-model="form.afiliacion" label="Afiliación" placeholder="ID Comercio" :length="15" class="exos-field" />
              <e-input v-model="form.giro" label="Giro (MCC)" placeholder="0000" :length="4" class="exos-field" />
              <e-input v-model="form.fecha" label="Fecha" type="date" class="exos-field" />
              <e-input v-model="form.hora" label="Hora" type="time" class="exos-field" />
              <e-select v-model="form.canal" label="Canal" :options="[{ label: 'ATM', value: 'ATM' }, { label: 'POS', value: 'POS' }]" class="exos-field" />
              <e-input v-model="form.pais" label="País (ISO)" placeholder="484" :length="3" class="exos-field" />
            </div>

            <div class="flex justify-end mt-12">
              <button type="button" @click="isSyntheticMode ? handleSendSynthetic() : handleSendMessage()" :disabled="isLoading || !isFormValid"
                      class="px-12 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-3 bg-[#8b5cf6] text-white hover:bg-[#7c3aed] shadow-lg shadow-purple-500/20 disabled:bg-gray-300 dark:disabled:bg-slate-800">
                <span v-if="isLoading" class="animate-spin border-2 border-white/30 border-t-white rounded-full w-4 h-4"></span>
                <span>{{ isSyntheticMode ? `Ejecutar Ráfaga (${batchSize} msgs)` : "Enviar Mensaje Manual" }}</span>
              </button>
            </div>
          </div>
        </div>

        <div v-if="responseFromServer || errorMessage" class="animate-fade-in pb-10">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div class="bg-white dark:bg-[#111827] p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm">
              <span class="bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-[10px] px-2 py-1 rounded font-bold uppercase tracking-widest inline-block mb-4">
                Trama Generada
              </span>
              <div class="bg-gray-50 dark:bg-black p-4 rounded-xl border border-gray-100 dark:border-slate-800 font-mono text-[10px] text-gray-500 dark:text-gray-400 break-all leading-relaxed max-h-32 overflow-y-auto custom-scrollbar">
                {{ responseFromServer?.generated_iso || "---" }}
              </div>
            </div>

            <div class="bg-white dark:bg-[#111827] p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col justify-center items-center text-center">
              <span class="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] px-2 py-1 rounded font-bold uppercase tracking-widest mb-4">
                Estatus del Envío
              </span>
              <div v-if="responseFromServer?.sent" class="flex flex-col items-center">
                <div class="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mb-2 text-xl">✓</div>
                <p class="text-sm font-bold text-gray-900 dark:text-white uppercase">Enviado </p>
              </div>
              <div v-else class="flex flex-col items-center">
                <div class="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center mb-2 text-xl">✕</div>
                <p class="text-sm font-bold text-red-600 uppercase">Fallo en Conexión</p>
              </div>
              <p class="mt-2 text-[10px] text-gray-400 font-medium uppercase leading-tight">
                {{ responseFromServer?.sent ? "Mensaje Entregado" : (errorMessage || "Sin respuesta del bridge") }}
              </p>
            </div>

            <div class="bg-white dark:bg-[#111827] p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col justify-center items-center text-center overflow-hidden">
              <span class="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-[10px] px-2 py-1 rounded font-bold uppercase tracking-widest mb-4">
                Respuesta del Host
              </span>
              <p class="font-bold tracking-tighter break-all w-full leading-tight text-2xl text-gray-900 dark:text-white">
                {{ responseFromServer?.sent ? (responseFromServer?.host_response || "00") : "N/A" }}
              </p>
              <p class="mt-4 text-[10px] text-gray-400 uppercase font-bold">Respuesta</p>
            </div>

          </div>
        </div>
      </div>
    </template>
  </content-tpl>
</template>

<script setup>
import { reactive, ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import axios from "axios";
import ContentTpl from "@/layouts/ContentTpl.vue";

const { t } = useI18n();
const isSyntheticMode = ref(false);
const batchSize = ref(1);
const isLoading = ref(false);
const responseFromServer = ref(null);
const errorMessage = ref(null);

const form = reactive({
  tarjeta: "",
  monto: "",
  afiliacion: "",
  giro: "",
  fecha: "",
  hora: "",
  canal: "",
  pais: "",
});

const isFormValid = computed(() => {
  if (isSyntheticMode.value) return batchSize.value > 0;

  // 1. Validaciones exactas de longitud
  const isValidTarjeta = form.tarjeta?.trim().length === 19;
  const isValidAfiliacion = form.afiliacion?.trim().length === 15;
  const isValidGiro = form.giro?.trim().length === 4;
  const isValidPais = form.pais?.trim().length === 3;

  // 2. Validar que los campos no estén vacíos
  const isValidFecha = form.fecha !== null && form.fecha.trim() !== "";
  const isValidHora = form.hora !== null && form.hora.trim() !== "";
  const isValidCanal = form.canal !== null && form.canal.trim() !== "";

  // 3. Retornamos true solo si TODO lo obligatorio se cumple. Monto es opcional.
  return (
    isValidTarjeta &&
    isValidAfiliacion &&
    isValidGiro &&
    isValidPais &&
    isValidFecha &&
    isValidHora &&
    isValidCanal
  );
});

const handleSendMessage = async () => {
  const payload = {
    is_synthetic: false,
    mti: "0200",
    batch_size: 1,
    fields: {
      2: form.tarjeta,
      4: Math.round(parseFloat(form.monto || 0) * 100).toString().padStart(12, "0"),
      7: formatFechaHoraISO(form.fecha, form.hora),
      18: form.giro.padStart(4, "0"),
      19: form.pais.padStart(3, "0"),
      42: form.afiliacion.padEnd(15, " "),
      61: form.canal,
      32: "00000000000",
      49: "484",
    },
  };
  await executePost(payload);
};

const handleSendSynthetic = async () => {
  await executePost({ is_synthetic: true, batch_size: batchSize.value, mti: "0200", fields: {} });
};

const executePost = async (payload) => {
  isLoading.value = true;
  responseFromServer.value = null;
  errorMessage.value = null;
  try {
    const { data } = await axios.post("http://localhost:8080/send-message", payload);
    if (data.results && data.results.length > 0) {
      responseFromServer.value = data.results[0];
    } else {
      responseFromServer.value = {
        generated_iso: data.generated_iso,
        host_response: data.host_response,
        sent: data.sent
      };
    }
    if (data.sent === false) errorMessage.value = data.host_response;
  } catch (err) {
    errorMessage.value = err.response?.data?.detail || "Error de comunicación.";
  } finally {
    isLoading.value = false;
  }
};

const formatFechaHoraISO = (f, h) => {
  if (!f || !h) return "";
  const [y, m, d] = f.split("-");
  const [hh, mm] = h.split(":");
  return `${m}${d}${hh}${mm}00`;
};
</script>

<style scoped>
.exos-field :deep(label) { display: block; font-size: 10px; font-weight: 700; text-transform: uppercase; color: #9ca3af; margin-bottom: 6px; }
.exos-field :deep(input), .exos-field :deep(select) { width: 100%; background-color: #f9fafb; border-radius: 12px; border: 1px solid #f3f4f6; padding: 12px 14px; font-size: 14px; transition: all 0.2s; }
.dark .exos-field :deep(input) { background-color: #000 !important; border-color: #1e293b; color: #f1f5f9; }
.exos-field :deep(input:focus) { border-color: #8b5cf6; outline: none; box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1); }
.animate-fade-in { animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>