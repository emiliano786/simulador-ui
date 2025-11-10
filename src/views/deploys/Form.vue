<template>
  <content-tpl>
    <template #header-left>
      <span
        class="title-1 text-neutral-black dark:text-neutral-white border-l-[3px] border-primary pl-2"
      >
        {{ t("deployForm.title") }}
      </span>
    </template>
    <template #main-content>
      <div class="flex flex-col gap-3">
        <!-- Sección General -->
        <e-card
          :label="t('deployForm.general.title')"
          bgColor="dark:bg-socrates-card-dark"
        >
          <template #contentCard>
            <div class="mb-4">
              <p class="text-body-4 text-gray-600 dark:text-neutral-white">
                {{ t("deployForm.general.description") }}
              </p>
            </div>
            <e-form ref="formGeneral" @submit="handleUpdateDeployGeneral">
              <div class="flex xs:w-full md:w-full">
                <e-input
                  v-model="formDeploy.name"
                  :label="t('deployForm.general.name')"
                  @clean="formDeploy.name = null"
                  :length="50"
                  required
                  class="mr-5"
                  :regex-valid-chars="{
                    regex: /[^a-z-]/g,
                    msg: 'Solo se permiten letras minúsculas y guiones medios (-)',
                  }"
                  :disabled="!isCreating"
                />

                <e-input
                  class="mr-5"
                  v-model.integer="formDeploy.port"
                  :label="
                    formDeploy.mode != 'CLIENT'
                      ? t('deployForm.general.portServer')
                      : t('deployForm.general.portClient')
                  "
                  @clean="formDeploy.port = null"
                  required
                  :length="4"
                />

                <e-select
                  v-model="formDeploy.environment"
                  :options="deployStore.deployOptions"
                  :label="'Sitio'"
                  required
                  :disabled="!isCreating"
                  @update:modelValue="setHost"
                />

                <e-input
                  v-if="formDeploy.environment == 'local'"
                  class="ml-5"
                  v-model="formDeploy.site"
                  :label="'IP Local'"
                  @clean="formDeploy.site = null"
                  required
                  :length="18"
                />
              </div>
              <p
                class="my-2 ml-1 text-body-4 text-gray-600 dark:text-neutral-white"
              >
                O suba su json con toda la configuración
              </p>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <e-file-picker
                    v-model="formDeploy.configFile"
                    showCleanBtn
                    @clean="formDeploy.configFile = null"
                    :label="'Configuración'"
                    :required="formDeploy.tlsEnabled"
                    @update:modelValue="handleFileChange('configFile')"
                  />
                </div>
              </div>
            </e-form>
          </template>
        </e-card>

        <!-- Sección Seguridad -->
        <e-card
          :label="t('layoutConfig.title')"
          class="mt-3"
          bgColor="dark:bg-socrates-card-dark"
        >
          <template #contentCard>
            <div class="mb-4">
              <p class="text-body-4 text-gray-600 dark:text-neutral-white">
                {{ t("deployForm.security.description") }}
              </p>
            </div>
            <e-form ref="formSecurity" @submit="handleUpdateDeploySecurity">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <e-file-picker
                    v-model="formDeploy.messagesFile"
                    showCleanBtn
                    @clean="formDeploy.messagesFile = null"
                    :label="'Mensajes'"
                    :required="formDeploy.tlsEnabled"
                    @update:modelValue="handleFileChange('messagesFile')"
                  />
                  <p
                    class="my-2 ml-1 text-body-4 text-gray-600 dark:text-neutral-white"
                  >
                    {{ formDeploy.totalMessages }} Mensajes
                  </p>
                </div>
              </div>
            </e-form>
          </template>
        </e-card>
      </div>
    </template>
    <template #footer>
      <div class="flex gap-3 justify-end">
        <e-btn
          level="2"
          :text="t('deployForm.actions.cancel')"
          @click="router.push({ name: 'deploys-query' })"
          width="w-[10rem] xxl:w-[12rem]"
          class="h-[2rem]"
        />
        <e-btn
          width="w-[10rem] xxl:w-[12rem]"
          class="h-[2rem]"
          :text="
            isCreating
              ? t('deployForm.actions.createDeploy')
              : t('deployForm.actions.saveChanges')
          "
          :disabled="
            !formDeploy.name ||
            !formDeploy.port ||
            !formDeploy.site ||
            !formDeploy.testCases
          "
          @click="handleSubmit"
        />
      </div>
    </template>
  </content-tpl>

  <!-- e-dialog para información TLS -->
  <e-dialog
    :show="showTlsDialog"
    bgColor="bg-white dark:bg-socrates-card-dark"
    :title="
      formDeploy.tlsEnabled
        ? t('deployForm.security.benefitsTitle')
        : t('deployForm.security.considerationsTitle')
    "
    @close="showTlsDialog = false"
  >
    <template #content>
      <div class="max-w-md p-2">
        <div
          v-if="formDeploy.tlsEnabled"
          class="p-3 rounded-lg bg-positive/10 border border-positive/20 dark:bg-positive/20 dark:border-positive/30 mb-2"
        >
          <div class="flex items-start gap-2">
            <e-icon name="verified" size="md" color="text-positive" />
            <div>
              <h4 class="text-body-3 text-positive dark:text-positive/90 mb-2">
                {{ t("deployForm.security.benefitsTitle") }}
              </h4>
              <ul
                class="text-body-4 text-gray-700 dark:text-gray-300 space-y-1"
              >
                <li class="flex items-center gap-1">
                  <e-icon name="check_circle" size="xs" color="text-positive" />
                  <span>{{
                    t("deployForm.security.benefits.encryption")
                  }}</span>
                </li>
                <li class="flex items-center gap-1">
                  <e-icon name="check_circle" size="xs" color="text-positive" />
                  <span>{{
                    t("deployForm.security.benefits.authentication")
                  }}</span>
                </li>
                <li class="flex items-center gap-1">
                  <e-icon name="check_circle" size="xs" color="text-positive" />
                  <span>{{ t("deployForm.security.benefits.integrity") }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div
          v-else
          class="p-3 rounded-lg bg-warning/10 border border-warning/20 dark:bg-warning/20 dark:border-warning/30 mb-2"
        >
          <div class="flex items-start gap-2">
            <e-icon name="warning" size="md" color="text-warning" />
            <div>
              <h4
                class="text-body-3 font-medium text-warning dark:text-warning/90 mb-2"
              >
                {{ t("deployForm.security.considerationsTitle") }}
              </h4>
              <ul
                class="text-body-4 text-gray-700 dark:text-gray-300 space-y-1"
              >
                <li class="flex items-center gap-1">
                  <e-icon name="info" size="xs" color="text-warning" />
                  <span>{{
                    t("deployForm.security.considerations.unencrypted")
                  }}</span>
                </li>
                <li class="flex items-center gap-1">
                  <e-icon name="info" size="xs" color="text-warning" />
                  <span>{{
                    t("deployForm.security.considerations.noVerification")
                  }}</span>
                </li>
                <li class="flex items-center gap-1">
                  <e-icon name="info" size="xs" color="text-warning" />
                  <span>{{
                    t("deployForm.security.considerations.developmentOnly")
                  }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="flex justify-end mt-4">
          <e-btn
            level="3"
            :text="t('deployForm.actions.close')"
            @click="showTlsDialog = false"
            class="min-w-[120px]"
          />
        </div>
      </div>
    </template>
  </e-dialog>

  <e-dialog
    :show="showDialog"
    bgColor="bg-white dark:bg-socrates-card-dark"
    :title="
      isCreating
        ? t('deployForm.confirmation.createTitle')
        : t('deployForm.confirmation.title')
    "
    @close="closeDialog"
  >
    <template #content>
      <div class="w-[60vw] max-w-2xl max-h-[80vh] overflow-y-auto">
        <!-- Información del deploy -->
        <div
          class="mb-4 p-3 bg-info-4 dark:bg-blue-900/20 rounded-lg border border-info-2 dark:border-blue-800"
        >
          <div class="flex items-center gap-2 mb-2">
            <e-icon
              name="info"
              size="sm"
              color="text-info dark:text-blue-400"
            />
            <h3 class="text-body-3 font-medium text-info-1 dark:text-blue-200">
              {{
                isCreating
                  ? t("deployForm.confirmation.createInfoTitle")
                  : t("deployForm.confirmation.infoTitle")
              }}
            </h3>
          </div>
          <p class="text-body-4 text-info-1 dark:text-blue-300">
            {{
              isCreating
                ? t("deployForm.confirmation.createInfoMessage")
                : t("deployForm.confirmation.infoMessage", { name: "" })
            }}
            <span
              class="font-mono font-bold text-info dark:text-info-2 text-body-3 px-1 bg-info-3 dark:bg-info/20 rounded"
            >
              {{ formDeploy.name }}
            </span>
            {{
              isCreating
                ? t("deployForm.confirmation.createInfoMessageEnd")
                : t("deployForm.confirmation.infoMessageEnd")
            }}
          </p>
        </div>

        <!-- Proceso técnico -->
        <div class="mb-4">
          <h4
            class="text-body-3 font-medium text-gray-800 dark:text-gray-200 mb-2"
          >
            {{
              isCreating
                ? t("deployForm.confirmation.createProcessTitle")
                : t("deployForm.confirmation.processTitle")
            }}
          </h4>
          <div class="space-y-2">
            <div
              class="flex items-start gap-2 p-2 bg-gray-200 dark:bg-gray-800 rounded-lg"
            >
              <div
                class="flex-shrink-0 w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center text-xs font-medium"
              >
                1
              </div>
              <div>
                <h5
                  class="text-body-4 font-medium text-gray-800 dark:text-gray-200 mb-0.5"
                >
                  {{ t("deployForm.confirmation.steps.validation.title") }}
                </h5>
                <p class="text-caption-2 text-gray-600 dark:text-gray-400">
                  {{
                    t("deployForm.confirmation.steps.validation.description")
                  }}
                </p>
              </div>
            </div>

            <div
              class="flex items-start gap-2 p-2 bg-gray-200 dark:bg-gray-800 rounded-lg"
            >
              <div
                class="flex-shrink-0 w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center text-xs font-medium"
              >
                2
              </div>
              <div>
                <h5
                  class="text-body-4 font-medium text-gray-800 dark:text-gray-200 mb-0.5"
                >
                  {{
                    isCreating
                      ? t(
                          "deployForm.confirmation.steps.createApplication.title"
                        )
                      : t("deployForm.confirmation.steps.application.title")
                  }}
                </h5>
                <p class="text-caption-2 text-gray-600 dark:text-gray-400">
                  {{
                    isCreating
                      ? t(
                          "deployForm.confirmation.steps.createApplication.description"
                        )
                      : t(
                          "deployForm.confirmation.steps.application.description"
                        )
                  }}
                </p>
              </div>
            </div>

            <div
              class="flex items-start gap-2 p-2 bg-gray-200 dark:bg-gray-800 rounded-lg"
            >
              <div
                class="flex-shrink-0 w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center text-xs font-medium"
              >
                3
              </div>
              <div>
                <h5
                  class="text-body-4 font-medium text-gray-800 dark:text-gray-200 mb-0.5"
                >
                  {{ t("deployForm.confirmation.steps.restart.title") }}
                </h5>
                <p class="text-caption-2 text-gray-600 dark:text-gray-400">
                  {{ t("deployForm.confirmation.steps.restart.description") }}
                </p>
              </div>
            </div>

            <div
              class="flex items-start gap-2 p-2 bg-gray-200 dark:bg-gray-800 rounded-lg"
            >
              <div
                class="flex-shrink-0 w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center text-xs font-medium"
              >
                4
              </div>
              <div>
                <h5
                  class="text-body-4 font-medium text-gray-800 dark:text-gray-200 mb-0.5"
                >
                  {{ t("deployForm.confirmation.steps.verification.title") }}
                </h5>
                <p class="text-caption-2 text-gray-600 dark:text-gray-400">
                  {{
                    t("deployForm.confirmation.steps.verification.description")
                  }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Botones de acción -->
        <div class="flex justify-end gap-3 py-1">
          <e-btn
            level="2"
            :text="t('deployForm.actions.cancel')"
            @click="closeDialog"
            class="min-w-[120px]"
          />
          <e-btn
            level="1"
            :text="
              isCreating
                ? t('deployForm.actions.createDeploy')
                : t('deployForm.actions.updateDeploy')
            "
            iconName="update"
            @click="isCreating ? handleCreateDeploy() : handleUpdateDeploy()"
            class="min-w-[160px]"
          />
        </div>
      </div>
    </template>
  </e-dialog>

  <e-dialog
    :show="showSuccessDialog"
    bgColor="bg-white dark:bg-socrates-card-dark"
    @close="closeSuccessDialog"
  >
    <template #content>
      <div class="w-[60vw] max-w-md max-h-[80vh] overflow-y-auto">
        <!-- Contenido de éxito con animaciones -->
        <div class="flex flex-col items-center justify-center py-8 px-6">
          <!-- Icono de éxito animado -->
          <div class="mb-6">
            <div
              class="w-20 h-20 bg-positive/20 rounded-full flex items-center justify-center animate-pulse"
            >
              <e-icon
                name="sym-task_alt"
                size="3rem"
                color="text-positive"
                class="animate-bounce"
              />
            </div>
          </div>

          <!-- Título de éxito -->
          <h3
            class="text-title-2 font-bold text-positive dark:text-positive/90 mb-3 text-center"
          >
            {{
              isCreating
                ? t("deployForm.success.createTitle")
                : t("deployForm.success.title")
            }}
          </h3>

          <!-- Mensaje descriptivo -->
          <p
            class="text-body-3 text-gray-700 dark:text-gray-300 text-center mb-6 leading-relaxed"
          >
            {{
              isCreating
                ? t("deployForm.success.createMessage")
                : t("deployForm.success.message", { name: "" })
            }}
            <span
              class="font-mono font-bold text-primary dark:text-primary-2 text-body-2 px-2 py-1 bg-primary/10 dark:bg-primary/20 rounded-lg border border-primary/20 dark:border-primary/30 shadow-sm"
            >
              {{ formDeploy.name }}
            </span>
            {{
              isCreating
                ? t("deployForm.success.createMessageEnd")
                : t("deployForm.success.messageEnd")
            }}
          </p>

          <!-- Información adicional -->
          <div
            class="w-full bg-positive/5 dark:bg-positive/10 rounded-lg p-4 mb-6 border border-positive/20 dark:border-positive/30"
          >
            <div class="flex items-center gap-2 mb-2">
              <span class="text-body-3 text-positive dark:text-positive/90">
                {{
                  isCreating
                    ? t("deployForm.success.createChangesApplied")
                    : t("deployForm.success.changesApplied")
                }}
              </span>
            </div>
            <ul
              class="text-caption-2 text-gray-600 dark:text-gray-400 space-y-1 ml-4"
            >
              <li class="flex items-center gap-1">
                <e-icon name="check_circle" size="xs" color="text-positive" />
                <span>{{
                  isCreating
                    ? t("deployForm.success.createChanges.general")
                    : t("deployForm.success.changes.general")
                }}</span>
              </li>
              <li class="flex items-center gap-1">
                <e-icon name="check_circle" size="xs" color="text-positive" />
                <span>{{
                  isCreating
                    ? t("deployForm.success.createChanges.logging")
                    : t("deployForm.success.changes.logging")
                }}</span>
              </li>
              <li v-if="formDeploy.tlsEnabled" class="flex items-center gap-1">
                <e-icon name="check_circle" size="xs" color="text-positive" />
                <span>{{
                  isCreating
                    ? t("deployForm.success.createChanges.tls")
                    : t("deployForm.success.changes.tls")
                }}</span>
              </li>
            </ul>
          </div>

          <!-- Botón de acción -->
          <div class="w-full">
            <e-btn
              level="1"
              :text="t('deployForm.actions.finish')"
              iconName="sym-arrow_forward"
              @click="closeSuccessDialog"
              class="w-full h-12 text-body-2 font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            />
          </div>

          <!-- Nota adicional -->
          <p
            class="text-caption-2 text-gray-500 dark:text-gray-400 text-center mt-4"
          >
            {{ t("deployForm.success.redirectNote") }}
          </p>
        </div>
      </div>
    </template>
  </e-dialog>

  <!-- Diálogo de Error -->
  <e-dialog
    :show="showErrorDialog"
    bgColor="bg-white dark:bg-socrates-card-dark"
    @close="closeErrorDialog"
  >
    <template #content>
      <div class="w-[60vw] max-w-md max-h-[80vh] overflow-y-auto">
        <!-- Contenido de error con animaciones -->
        <div class="flex flex-col items-center justify-center py-8 px-6">
          <!-- Icono de error animado -->
          <div class="mb-6">
            <div
              class="w-20 h-20 bg-danger/20 rounded-full flex items-center justify-center animate-pulse"
            >
              <e-icon
                name="error"
                size="3rem"
                color="text-danger"
                class="animate-bounce"
              />
            </div>
          </div>

          <!-- Título de error -->
          <h3
            class="text-title-2 font-bold text-danger dark:text-danger/90 mb-3 text-center"
          >
            {{
              isCreating
                ? t("deployForm.error.createTitle")
                : t("deployForm.error.updateTitle")
            }}
          </h3>

          <!-- Mensaje descriptivo -->
          <p
            class="text-body-3 text-gray-700 dark:text-gray-300 text-center mb-6 leading-relaxed"
          >
            {{
              isCreating
                ? t("deployForm.error.createMessage")
                : t("deployForm.error.updateMessage")
            }}
          </p>

          <!-- Nombre del deploy -->
          <div class="mb-6 text-center">
            <span
              class="font-mono font-bold text-danger dark:text-danger-2 text-body-2 px-3 py-2 bg-danger/10 dark:bg-danger/20 rounded-lg border border-danger/20 dark:border-danger/30 shadow-sm"
            >
              {{ formDeploy.name }}
            </span>
          </div>

          <!-- Detalles del error -->
          <div
            v-if="errorMessage"
            class="w-full bg-danger/5 dark:bg-danger/10 rounded-lg p-4 mb-6 border border-danger/20 dark:border-danger/30"
          >
            <div class="flex items-center gap-2 mb-2">
              <span class="text-body-3 text-danger dark:text-danger/90">
                {{ t("deployForm.error.errorDetail") }}
              </span>
            </div>
            <div
              class="text-caption-2 text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700 font-mono text-xs"
            >
              {{ errorMessage }}
            </div>
          </div>

          <!-- Botón de acción -->
          <div class="w-full">
            <e-btn
              level="1"
              :text="t('deployForm.error.actions.close')"
              @click="closeErrorDialog"
              class="w-full h-12 text-body-2 font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            />
          </div>

          <!-- Nota adicional -->
          <p
            class="text-caption-2 text-gray-500 dark:text-gray-400 text-center mt-4"
          >
            {{ t("deployForm.error.redirectNote") }}
          </p>
        </div>
      </div>
    </template>
  </e-dialog>
</template>

<script setup>
import {
  ref,
  computed,
  reactive,
  watch,
  onMounted,
  onBeforeUnmount,
} from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { loading } from "@alexochihua/exos-library-components";
import ContentTpl from "@/layouts/ContentTpl.vue";
import { useDeployStore } from "@/stores/deploy";
import { useLayoutStore } from "@/stores/layouts";
import { DateTime } from "luxon";

const { t } = useI18n();
const router = useRouter();
const deployStore = useDeployStore();
const layoutStore = useLayoutStore();

// Determinar si estamos creando o actualizando un deploy
const isCreating = computed(() => !deployStore.selectedDeploy);

// Formulario reactivo
const formDeploy = reactive({
  name: "",
  port: "",
  site: "0.0.0.0",
  environment: "local",
  testCases: [],
  totalMessages: 0,
});

const validatedFormsDeploy = ref({
  general: false,
  security: false,
  logging: false,
});

// Ref para los formularios
const formGeneral = ref(null);
const formSecurity = ref(null);
const formLogging = ref(null);

const showDialog = ref(false);
const showSuccessDialog = ref(false);
const showTlsDialog = ref(false);
const showErrorDialog = ref(false);
const errorMessage = ref(null);

// Llenar los campos con la info del selectedDeploy
const selectedDeploy = computed(() => deployStore.selectedDeploy);

// Obtener datos del store de layouts
const layoutConfigurations = computed(() => layoutStore.layoutConfigurations);

const loggingOptions = [
  { label: t("deployForm.logging.options.debug"), value: 1 },
  { label: t("deployForm.logging.options.info"), value: 2 },
];

const setHost = () => {
  let hostEnvironment = deployStore.deployOptions.filter((option) => {
    return option.value == formDeploy.environment;
  });
  if (hostEnvironment[0].value != "local") {
    formDeploy.site = hostEnvironment[0].ip;
  }
};

onMounted(async () => {
  // Scroll al inicio de la página
  window.scrollTo(0, 0);
  await deployStore.getDeploymentsCatalogs();
  console.log("Form mounted - selectedDeploy:", selectedDeploy.value);
  if (selectedDeploy.value) {
    formDeploy.name = selectedDeploy.value.name || "";
    formDeploy.port = selectedDeploy.value.port || "";
    formDeploy.deployTarget = selectedDeploy.value.deployTarget || null;
    formDeploy.containers = selectedDeploy.value.containers || null;
    formDeploy.tlsEnabled = selectedDeploy.value.tlsEnabled || false;
    formDeploy.key = selectedDeploy.value.key || null;
    formDeploy.cert = selectedDeploy.value.cert;
    formDeploy.logging = selectedDeploy.value.logging || null;
    formDeploy.layout = selectedDeploy.value.layout?.id || "1";
    formDeploy.site = selectedDeploy.value.site || "";
    formDeploy.mode = selectedDeploy.value.mode;

    // Establecer el layout actual como seleccionado
    selectedLayout.value = formDeploy.layout;
    console.log("Form initialized in edit mode:", formDeploy);
  } else {
    // Modo creación: limpiar formulario
    deployStore.clearSelectedDeploy();
    selectedLayout.value = null;
    console.log("Form initialized in create mode");
  }
});

// Método para ejecutar el submit del formulario
const handleSubmit = () => {
  formGeneral.value.submit();

  // Verificar si todos los formularios son válidos y el layout está seleccionado
  if (validatedFormsDeploy.value.general) {
    openDialog();
  }
};

const handleUpdateDeployGeneral = (data) => {
  validatedFormsDeploy.value.general = data;
};

const handleUpdateDeployLogging = (data) => {
  validatedFormsDeploy.value.logging = data;
};

const handleUpdateDeploySecurity = (data) => {
  // Si TLS no está habilitado, el formulario de seguridad siempre es válido
  if (!formDeploy.tlsEnabled) {
    validatedFormsDeploy.value.security = true;
  } else {
    // Si TLS está habilitado, usar la validación normal
    validatedFormsDeploy.value.security = data;
  }
};

const openDialog = () => {
  showDialog.value = true;
};

const closeDialog = () => {
  showDialog.value = false;
};

// Función para actualizar el deploy
const handleUpdateDeploy = async () => {
  try {
    loading.show({ project: "services" });
    let payload;

    if (formDeploy.tlsEnabled) {
      const fd = new FormData();
      fd.append("name", String(formDeploy.name));
      fd.append("id", String(selectedDeploy.value.id));
      fd.append("port", String(formDeploy.port));
      fd.append("deployTarget", String(formDeploy.deployTarget));
      fd.append("containers", String(formDeploy.containers));
      fd.append("logging", String(formDeploy.logging));
      fd.append("tlsEnabled", "true");
      fd.append("layout", String(selectedLayout.value));
      fd.append("site", formDeploy.site ?? "");
      fd.append("mode", String(formDeploy.mode));
      fd.append("key", formDeploy.key, `${formDeploy.name}-key.pem`);
      fd.append("cert", formDeploy.cert, `${formDeploy.name}-cert.pem`);
      payload = fd;
    } else {
      payload = {
        ...formDeploy,
        layout: selectedLayout.value,
        tlsEnabled: false,
        id: selectedDeploy.value.id,
      };
    }

    await deployStore.createDeploy(payload, formDeploy.tlsEnabled);

    loading.hide();
    closeDialog();
    showSuccessDialog.value = true;
  } catch (error) {
    // Ocultar loading en caso de error
    loading.hide();
    console.error("Error al actualizar el deploy:", error);

    // Cerrar el diálogo de confirmación antes de mostrar el error
    closeDialog();

    // Mostrar diálogo de error
    errorMessage.value =
      error.response?.data?.message ||
      error.message ||
      "Error desconocido al actualizar el despliegue";
    showErrorDialog.value = true;
  }
};

// Función para cerrar el diálogo de éxito y navegar
const closeSuccessDialog = () => {
  showSuccessDialog.value = false;
  router.push({ name: "deploys-query" });
};

// Función para cerrar el diálogo de error
const closeErrorDialog = () => {
  showErrorDialog.value = false;
  errorMessage.value = null;
  router.push({ name: "deploys-query" });
};

// Función para crear el deploy
const handleCreateDeploy = async () => {
  try {
    loading.show({ project: "services" });

    delete formDeploy.configFile;
    await deployStore.createDeploy(
      {
        ...formDeploy,
      },
      false
    );

    loading.hide();
    closeDialog();

    showSuccessDialog.value = true;
  } catch (error) {
    loading.hide();
    console.error("Error al crear el deploy:", error);

    // Cerrar el diálogo de confirmación antes de mostrar el error
    closeDialog();

    // Mostrar diálogo de error
    errorMessage.value =
      error.response?.data?.message ||
      error.message ||
      "Error desconocido al crear el despliegue";
    showErrorDialog.value = true;
  }
};

// Variable para almacenar el layout seleccionado
const selectedLayout = ref(null);

// Función para seleccionar un layout
const selectLayout = (layoutId) => {
  selectedLayout.value = layoutId;
  formDeploy.layout = layoutId;
};

const handleFileChange = async (file) => {
  const text = await formDeploy[`${file}`].text();
  const clean = text.replace(/^\uFEFF/, "");
  const json = JSON.parse(clean);

  if (file == "configFile") {
    formDeploy.name = json.name.toString() || "";
    formDeploy.port = json.port.toString() || "0000";
    formDeploy.environment = json.environment.toString() || "local";
    formDeploy.totalMessages = json.testCases.length;

    if (deployStore.deployOptions.find(siteExists)) {
      formDeploy.site = json.site.toString();
    }
  }

  formDeploy.testCases = json.testCases;

  if (file == "messagesFile") {
    formDeploy.totalMessages = json.testCases.length;
  }

  function siteExists(site) {
    return site.value.toString() == json.environment.toString();
  }
};

onBeforeUnmount(() => {
  deployStore.clearSelectedDeploy();
});
</script>
