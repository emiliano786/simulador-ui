<template>
  <content-tpl>
    <template #header-left>
      <span
        class="title-1 text-neutral-black dark:text-neutral-white border-l-[3px] border-primary pl-2"
      >
        {{ t("simulator.title") || "Simulador de Transacciones ISO8583" }}
      </span>
    </template>

    <template #main-content>
      <div class="flex flex-col gap-4">
        <e-card bgColor="bg-white dark:bg-socrates-card-dark">
          <template #contentCard>
            <e-form ref="formSimulator" @submit="handleSendMessage">
              <div class="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-8">
                <e-input
                  v-model="form.tarjeta"
                  label="Tarjeta"
                  placeholder="PAN"
                  :length="19"
                  required
                />

                <e-input
                  v-model="form.monto"
                  label="Monto"
                  placeholder="0.00"
                  type="number"
                  :length="10"
                  required
                />

                <e-input
                  v-model="form.afiliacion"
                  label="Afiliación"
                  placeholder="ID Comercio"
                  :length="15"
                />

                <e-input
                  v-model="form.giro"
                  label="Giro (MCC)"
                  placeholder="0000"
                  :length="4"
                  required
                  :regex-valid-chars="{
                    regex: /[^0-9]/g,
                    msg: 'Solo se permiten números',
                  }"
                />

                <e-input
                  v-model="form.fecha"
                  label="Fecha"
                  type="date"
                  required
                />
                <e-input
                  v-model="form.hora"
                  label="Hora"
                  type="time"
                  required
                />

                <e-select
                  v-model="form.canal"
                  label="Canales"
                  :options="[
                    { label: 'ATM', value: 'ATM' },
                    { label: 'POS', value: 'POS' },
                  ]"
                />

                <e-input
                  v-model="form.pais"
                  label="Países"
                  placeholder="484"
                  :length="3"
                />
              </div>
              <div
                class="col-span-full flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg mb-4"
              >
                <span class="text-sm font-bold text-gray-700 dark:text-gray-300"
                  >Modo de Generación:</span
                >
                <div class="flex items-center gap-2">
                  <input
                    type="checkbox"
                    v-model="isSyntheticMode"
                    id="syntheticToggle"
                    class="w-4 h-4 text-primary"
                  />
                  <label for="syntheticToggle" class="text-sm cursor-pointer"
                    >Usar Datos Sintéticos (XML/CSV)</label
                  >
                </div>

                <div
                  v-if="isSyntheticMode"
                  class="flex items-center gap-2 ml-auto"
                >
                  <span
                    class="text-sm font-bold text-gray-700 dark:text-gray-300"
                    >Cantidad:</span
                  >
                  <input
                    type="number"
                    v-model="batchSize"
                    min="1"
                    max="50"
                    class="w-16 p-1 text-xs border rounded"
                  />
                </div>
              </div>

              <div
                v-if="!isSyntheticMode"
                class="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-8"
              ></div>

              <div
                v-else
                class="p-10 text-center border-2 border-dashed border-gray-300 rounded-xl"
              >
                <p class="text-gray-500 italic">
                  El simulador generará datos automáticamente basados en
                  patrones estadísticos y reglas del estándar XML.
                </p>
              </div>

              <div class="flex justify-end mt-10">
                <e-btn
                  type="button"
                  text="Generar Ráfaga (Sintético)"
                  class="bg-[#4a5568] hover:bg-[#2d3748] text-white px-6 h-12 rounded-lg text-body-2 font-bold shadow-md"
                  :loading="isLoading && isSyntheticAction"
                  @click="handleSendSynthetic"
                />
                <e-btn
                  type="submit"
                  text="Enviar mensaje"
                  class="bg-[#ff4d5a] hover:bg-[#e64551] text-white px-10 h-12 rounded-lg text-body-2 font-bold shadow-md"
                  :loading="isLoading"
                />
              </div>
            </e-form>
          </template>
        </e-card>

        <div
          v-if="responseFromServer || errorMessage"
          class="mt-2 animate-fade-in"
        >
          <e-card
            :label="
              errorMessage ? 'Error en el Mensaje' : 'Resultado de Simulación'
            "
          >
            <template #contentCard>
              <div class="font-mono text-sm space-y-3">
                <div v-if="responseFromServer" class="space-y-2">
                  <div
                    class="p-3 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200"
                  >
                    <p class="text-primary font-bold underline mb-1">
                      Mensaje ISO Generado:
                    </p>
                    <p class="break-all">
                      {{ responseFromServer.generated_iso }}
                    </p>
                  </div>
                  <div
                    class="p-3 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200"
                  >
                    <p class="text-positive font-bold underline mb-1">
                      Respuesta del Host (Hex):
                    </p>
                    <p class="text-lg font-bold">
                      {{ responseFromServer.host_response }}
                    </p>
                  </div>
                </div>

                <div
                  v-if="errorMessage"
                  class="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200"
                >
                  <p class="font-bold">Error:</p>
                  <pre class="whitespace-pre-wrap">{{
                    formatError(errorMessage)
                  }}</pre>
                </div>
              </div>
            </template>
          </e-card>
        </div>
      </div>
    </template>
  </content-tpl>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import axios from "axios";
import ContentTpl from "@/layouts/ContentTpl.vue";

const { t } = useI18n();
const isLoading = ref(false);
const responseFromServer = ref(null);
const errorMessage = ref(null);
const isSyntheticMode = ref(false);
const batchSize = ref(1);

// Formulario con valores iniciales
const form = reactive({
  tarjeta: "",
  monto: "",
  afiliacion: "",
  giro: "",
  fecha: "",
  hora: "",
  canal: "ATM",
  pais: "484",
});

/**
 * Procesa el envío al backend de Python (Código 4)
 */
const isSyntheticAction = ref(false);

const handleSendMessage = async () => {
  isSyntheticAction.value = false;
  isLoading.value = true;
  errorMessage.value = null;
  responseFromServer.value = null;

  // Mapeo de campos a formato ISO estructurado para el Código 4
  const payload = {
    is_synthetic: false,
    mti: "0200",
    batch_size: batchSize.value,
    fields: {
      2: form.tarjeta,
      4: formatMontoISO(form.monto),
      7: formatFechaHoraISO(form.fecha, form.hora),
      18: form.giro.padStart(4, "0"),
      19: form.pais.padStart(3, "0"),
      42: form.afiliacion.padEnd(15, " "),
      61: form.canal,
    },
  };
  await executePost(payload);
};

const handleSendSynthetic = async () => {
  isSyntheticAction.value = true;
  const payload = {
    is_synthetic: true,
    batch_size: batchSize.value, // Puedes hacerlo dinámico
    mti: "0200",
    fields: {}, // El backend lo llenará solo
  };
  await executePost(payload);
};

/**
 * Función base para la petición
 */
const executePost = async (payload) => {
  isLoading.value = true;
  errorMessage.value = null;
  responseFromServer.value = null;

  try {
    // Envío a la API de FastAPI
    const { data } = await axios.post(
      "http://localhost:8080/send-message",
      payload,
    );
    if (data.mode === "synthetic") {
      responseFromServer.value = data.results[0]; // Mostramos el primero o podrías iterarlos
    } else {
      responseFromServer.value = data.results[0];
    }
  } catch (err) {
    errorMessage.value = err.response?.data?.detail || "Error de comunicación";
  } finally {
    isLoading.value = false;
  }
};

/**
 * Formatea el monto a 12 dígitos (centavos)
 */
const formatMontoISO = (monto) => {
  const cents = Math.round(parseFloat(monto || 0) * 100);
  return cents.toString().padStart(12, "0");
};

/**
 * Formatea fecha y hora a MMDDhhmmss
 */
const formatFechaHoraISO = (fecha, hora) => {
  if (!fecha || !hora) return "";
  const [y, m, d] = fecha.split("-");
  const [hh, mm] = hora.split(":");
  return `${m}${d}${hh}${mm}00`;
};

const formatError = (error) => {
  return typeof error === "object" ? JSON.stringify(error, null, 2) : error;
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
