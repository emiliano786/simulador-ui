<template>
  <content-tpl>
    <template #header-left>
      <span class="title-1 text-neutral-black dark:text-neutral-white border-l-[3px] border-primary pl-2">
        {{ t('simulator.title') || 'Simulador de Transacciones ISO8583' }}
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
                    msg: 'Solo se permiten números'
                  }"
                />

                <e-input v-model="form.fecha" label="Fecha" type="date" required />
                <e-input v-model="form.hora" label="Hora" type="time" required />
                
                <e-select 
                  v-model="form.canal" 
                  label="Canales" 
                  :options="[
                    {label: 'ATM', value: 'ATM'}, 
                    {label: 'POS', value: 'POS'}
                  ]" 
                />

                <e-input 
                  v-model="form.pais" 
                  label="Países" 
                  placeholder="484" 
                  :length="3"
                />
              </div>

              <div class="flex justify-end mt-10">
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

        <div v-if="responseFromServer || errorMessage" class="mt-2 animate-fade-in">
          <e-card :label="errorMessage ? 'Error en el Mensaje' : 'Resultado de Simulación'">
            <template #contentCard>
              <div class="font-mono text-sm space-y-3">
                <div v-if="responseFromServer" class="space-y-2">
                  <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200">
                    <p class="text-primary font-bold underline mb-1">Mensaje ISO Generado:</p>
                    <p class="break-all">{{ responseFromServer.generated_iso }}</p>
                  </div>
                  <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200">
                    <p class="text-positive font-bold underline mb-1">Respuesta del Host (Hex):</p>
                    <p class="text-lg font-bold">{{ responseFromServer.host_response }}</p>
                  </div>
                </div>
                
                <div v-if="errorMessage" class="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
                  <p class="font-bold">Error:</p>
                  <pre class="whitespace-pre-wrap">{{ formatError(errorMessage) }}</pre>
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
import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import axios from 'axios';
import ContentTpl from "@/layouts/ContentTpl.vue";

const { t } = useI18n();
const isLoading = ref(false);
const responseFromServer = ref(null);
const errorMessage = ref(null);

// Formulario con valores iniciales
const form = reactive({
  tarjeta: '', 
  monto: '', 
  afiliacion: '', 
  giro: '',
  fecha: '', 
  hora: '', 
  canal: 'ATM', 
  pais: '484'
});

/**
 * Procesa el envío al backend de Python (Código 4)
 */
const handleSendMessage = async () => {
  isLoading.value = true;
  errorMessage.value = null;
  responseFromServer.value = null;

  // Mapeo de campos a formato ISO estructurado para el Código 4
  const payload = {
    mti: "0200", 
    fields: {
      "2": form.tarjeta,
      "4": formatMontoISO(form.monto),
      "7": formatFechaHoraISO(form.fecha, form.hora),
      "18": form.giro.padStart(4, '0'),
      "19": form.pais.padStart(3, '0'),
      "42": form.afiliacion.padEnd(15, ' '),
      "61": form.canal
    }
  };

  try {
    // Envío a la API de FastAPI
    const { data } = await axios.post('http://localhost:8080/send-message', payload);
    responseFromServer.value = data;
  } catch (err) {
    // Manejo de errores de validación del backend
    errorMessage.value = err.response?.data?.detail || "Error de comunicación con el servidor";
  } finally {
    isLoading.value = false;
  }
};

/**
 * Formatea el monto a 12 dígitos (centavos)
 */
const formatMontoISO = (monto) => {
  const cents = Math.round(parseFloat(monto || 0) * 100);
  return cents.toString().padStart(12, '0');
};

/**
 * Formatea fecha y hora a MMDDhhmmss
 */
const formatFechaHoraISO = (fecha, hora) => {
  if (!fecha || !hora) return "";
  const [y, m, d] = fecha.split('-');
  const [hh, mm] = hora.split(':');
  return `${m}${d}${hh}${mm}00`;
};

const formatError = (error) => {
  return typeof error === 'object' ? JSON.stringify(error, null, 2) : error;
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>