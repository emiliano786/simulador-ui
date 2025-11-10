<!-- eslint-disable exos/data-test -->
<template>
  <content-tpl>
    <template #top-left>
      <div class="flex flex-col gap-1 flex-1">
        <span
          class="title-1 text-neutral-black dark:text-neutral-white border-l-[3px] border-primary pl-2"
        >
          {{ $t("deploysMonitoring.title") }}
        </span>
        <span class="text-body-4 text-neutralGrey dark:text-neutralLightGrey">
          {{ $t("deploysMonitoring.description") }}
        </span>
      </div>
    </template>
    <template #top-right>
      <div class="flex gap-3 items-center justify-end w-full">
        <!-- Búsqueda global -->
        <e-input
          v-model="globalSearch"
          :label="$t('deploysMonitoring.globalSearch')"
          class="w-full xxl:w-72"
          @clean="globalSearch = null"
        >
          <template #icon>
            <e-icon
              name="search"
              size="xs"
              color="text-secondary dark:text-neutral-white"
            />
          </template>
        </e-input>
        <span>
          <e-icon
            size="lg"
            data-test="pod-status-icon"
            name="sym-restart_alt"
            class="text-secondary dark:text-neutral-white mt-3"
            @click="
              () => {
                showRestartDialogAll = true;
              }
            "
          />
        </span>
        <span>
          <e-icon
            v-if="shouldPoll"
            size="lg"
            data-test="pod-status-icon"
            name="play_circle"
            class="text-secondary dark:text-neutral-white mt-3"
            @click="() => (shouldPoll = false)"
          />
          <e-icon
            v-else
            size="lg"
            data-test="pod-status-icon"
            name="pause_circle"
            class="text-secondary dark:text-neutral-white mt-3"
            @click="() => (shouldPoll = true)"
          />
        </span>
        <e-btn
          v-if="canCreate('deploy-monitoring')"
          rounded
          class="mt-2"
          color="bg-primary hover:bg-primary/80 dark:bg-socrates-main-dark dark:hover:bg-socrates-main-dark/80"
          @click="goToCreateDeploy"
        >
          <template #content>
            <div
              class="flex justify-center items-center gap-1 w-36 xxl:w-40 h-6"
            >
              <e-icon
                name="add"
                size="xs"
                color="text-white dark:text-neutral-white"
              />
              <span
                class="text-body-3 text-white dark:from-white dark:via-white/90 dark:to-white/80"
              >
                {{ $t("deploysMonitoring.newDeployment") }}
              </span>
            </div>
          </template>
        </e-btn>
        <e-dropdown
          over
          data-test="filter-deploy-dropdown"
          ref="filterDropdown"
          class="mt-2"
        >
          <template #contentDropdown>
            <div
              class="xs:w-[82vw] sm:w-[88.6vw] md:w-[93vw] lg:w-[83.3vw] xl:w-[83vw] xxl:w-[75vw] min-h-[10vh] rounded-2xl"
            >
              <div
                class="ml-2 mt-2 md:ml-5 mb-3 flex w-full title-1 py-1 text-black dark:text-white"
              >
                {{ $t("deploysMonitoring.filters.criteriaTitle") }}
              </div>
              <div class="px-6">
                <e-form>
                  <div
                    class="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4 mb-6"
                  >
                    <!-- Filtro por nombre -->
                    <e-input
                      v-model="tempFilters.name"
                      :label="$t('deploysMonitoring.filters.search')"
                      @clean="tempFilters.name = null"
                    >
                      <template #icon>
                        <e-icon
                          name="search"
                          size="xs"
                          color="text-secondary dark:text-neutral-white"
                        />
                      </template>
                    </e-input>

                    <!-- Filtro por estado -->
                    <e-select
                      :options="statusFilterOptions"
                      :label="$t('deploysMonitoring.filters.status')"
                      v-model="tempFilters.status"
                      @clean="tempFilters.status = null"
                    />

                    <!-- Filtro por rango de puerto -->
                    <div
                      class="flex xs:flex-col sm:flex-row items-center gap-2"
                    >
                      <e-input
                        v-model="tempFilters.minPort"
                        :label="$t('deploysMonitoring.filters.minPort')"
                        type="number"
                        class="flex-1"
                        @clean="tempFilters.minPort = null"
                      />
                      <e-input
                        v-model="tempFilters.maxPort"
                        :label="$t('deploysMonitoring.filters.maxPort')"
                        type="number"
                        class="flex-1"
                        @clean="tempFilters.maxPort = null"
                      />
                    </div>
                    <div
                      class="flex xs:flex-col sm:flex-row items-end w-full gap-2 justify-end md:col-start-3"
                    >
                      <e-btn
                        level="2"
                        width="w-full"
                        :text="$t('deploysMonitoring.filters.clearFilters')"
                        @click="clearFilters"
                        class="h-8"
                      />
                      <e-btn
                        level="1"
                        width="w-full"
                        :text="$t('deploysMonitoring.filters.applyFilters')"
                        @click="applyFilters"
                        class="h-8"
                      />
                    </div>
                  </div>
                </e-form>
              </div>
            </div>
          </template>
        </e-dropdown>
      </div>
    </template>
    <template #main-content>
      <div
        class="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 xxl:grid-cols-4 gap-3 h-fit"
      >
        <div
          class="h-44 flex flex-col justify-between rounded-2xl py-2.5 px-3.5 bg-neutral-white dark:bg-socrates-main-dark shadow-sm shadow-primary-1 border border-primary/5 dark:shadow-slate-500"
          v-for="deploy in filteredDeploys"
          :key="deploy.id"
        >
          <!-- Header del card con título y botón de configuración -->
          <div class="flex flex-col gap-1">
            <div class="flex justify-between items-center w-full">
              <div
                class="subtitle-2 flex flex-wrap w-full items-center text-neutral-black dark:text-neutral-white"
              >
                {{ deploy.name }}
              </div>
              <div class="flex items-center">
                <div
                  v-if="canRestart('deploy-monitoring')"
                  class="flex items-center justify-center p-1 rounded-full hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors duration-200 cursor-pointer"
                  @click="confirmRestartDeploy(deploy)"
                  :title="$t('deploysMonitoring.restartDeploy')"
                >
                  <e-icon
                    data-test="pod-restart-icon"
                    color="text-semantic-inactive"
                    name="sym-restart_alt"
                    size="xs"
                  />
                </div>

                <div
                  v-if="filteredDeployActionOptions.length > 0"
                  class="flex items-center justify-center p-1 rounded-full hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors duration-200 cursor-pointer"
                  :title="$t('deploysMonitoring.viewDetails')"
                >
                  <e-dropdown
                    iconName="more_vert"
                    colorIcon="text-semantic-inactive"
                    sizeIcon="xs"
                    displayDirection="bl"
                    onlyIcon
                    over
                    textTransform="cap"
                    :options="filteredDeployActionOptions"
                    @selected="handleActionSelected(deploy, $event)"
                  />
                </div>
              </div>
            </div>
            <!-- Estado del deploy -->
            <div class="flex justify-between items-center w-full">
              <div
                class="max-w-1/3 w-fit px-2 h-fit flex items-center gap-1 border rounded-2xl justify-center backdrop-blur-sm"
                :class="{
                  'border-positive bg-gradient-to-r from-positive/20 via-positive/15 to-positive/10':
                    deploy.finished === true,
                  'border-danger bg-gradient-to-r from-danger/20 via-danger/15 to-danger/10':
                    deploy.finished == false,
                }"
              >
                <span>
                  <e-icon
                    size=".8rem"
                    data-test="pod-status-icon"
                    name="sym-fiber_manual_record"
                    :class="{
                      'text-positive': deploy.finished === true,
                      'text-danger blink': deploy.finished === false,
                    }"
                  />
                </span>
                <span
                  class="text-body-3"
                  :class="{
                    'text-blue-500': deploy.status === 'succeeded',
                    'text-gray-400': deploy.status === 'unknown',
                  }"
                  >{{ getStatusTranslation(deploy.finished) }}</span
                >
              </div>

              <!-- Indicador de TLS -->
              <div class="flex items-center gap-1">
                <div
                  class="px-2 py-1 rounded-lg text-body-3 flex items-center gap-1"
                  :class="{
                    ' bg-info-4 text-info-1 border border-info-2 dark:bg-info/20 dark:text-info-2 dark:border-info/30':
                      deploy.tlsEnabled,
                    'bg-gray-100 text-gray-600 border border-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600':
                      !deploy.tlsEnabled,
                  }"
                >

                  Promedio de respuesta: {{deploy.metadata?.[0]?.avg_response_time != null ? deploy.metadata[0].avg_response_time : '...'  }}
                </div>
              </div>
            </div>
          </div>

          <!-- Información de contenedores y puerto -->
          <div class="w-full flex items-center gap-2 justify-between">
            <div class="flex flex-col w-full">
              <div class="flex w-full items-center space-x-1">
                <span class="text-body-4">Mensajes enviados: </span>
                <span class="text-body-3">{{
                  deploy.metadata?.[0]?.total_sended != null ? deploy.metadata[0].total_sended: '...'
                }}</span>
              </div>
            </div>
            <div class="flex w-full items-center space-x-1">
              <span class="text-body-4">Mensajes recibidos: </span>
              <span class="text-body-3">{{
               deploy.metadata?.[0]?.total_received != null? deploy.metadata[0].total_received : '...'
              }}</span>
            </div>
          </div>

          <!-- Footer con información de certificado TLS -->
          <div v-if="deploy.tlsEnabled" class="w-full">
            <div class="w-full">
              <div
                class="px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
              >
                <div class="flex items-center gap-1">
                  <e-icon
                    name="vpn_key"
                    size="0.9rem"
                    color=" 'text-positive'"
                  />
                  <span class="text-caption-1 text-gray-600 dark:text-gray-400">
                    La prueba concluyo de manera exitosa
                    {{ deploy.metadata?.[0]?.finished_at.toLocaleString() != null ? deploy.metadata[0].finished_at.toLocaleString() : 'Ejecutandose...'}}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="w-full">
            <div
              class="px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
            >
              <div class="flex items-center gap-1">
                <e-icon
                  name="info"
                  size="xs"
                  color="text-gray-500 dark:text-gray-400"
                />
                <span class="text-caption-1 text-gray-600 dark:text-gray-400">
                  La prueba concluyo de manera exitosa
                  {{
                    deploy.metadata?.[0]?.finished_at != null ? new Date(deploy.metadata[0].finished_at).toLocaleString() : 'Ejecutandose...'
                  }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </content-tpl>

  <!-- Diálogo de confirmación de reinicio -->
  <e-dialog
    :show="showRestartDialog"
    bgColor="bg-white dark:bg-socrates-card-dark"
    :title="$t('deploysMonitoring.restart.confirmation.title')"
    @close="closeRestartDialog"
  >
    <template #content>
      <div class="w-[60vw] max-w-2xl max-h-[80vh] overflow-y-auto">
        <!-- Información del deploy -->
        <div
          class="mb-4 p-3 bg-info-4 dark:bg-blue-900/20 rounded-lg border border-info-2 dark:border-blue-800"
        >
          <div class="mb-4 p-3">
            <div class="flex items-center gap-2 mb-2">
              <e-icon
                name="info"
                size="sm"
                color="text-info dark:text-blue-400"
              />
              <h3
                class="text-body-3 font-medium text-info-1 dark:text-blue-200"
              >
                {{ $t("deploysMonitoring.restart.confirmation.title") }}
              </h3>
            </div>
            <p class="text-body-4 text-info-1 dark:text-blue-300">
              {{ $t("deploysMonitoring.restart.confirmation.message") }}
              <span
                class="font-mono font-bold text-info dark:text-info-2 text-body-3 px-1 bg-info-3 dark:bg-info/20 rounded"
              >
                {{ selectedDeployForRestart?.name }}
              </span>
              {{ $t("deploysMonitoring.restart.confirmation.messageEnd") }}
            </p>
          </div>

          <div
            class="space-y-2 text-caption-2 text-gray-600 dark:text-gray-400"
          >
            <div class="flex justify-between">
              <span>{{ $t("deploysMonitoring.port") }}:</span>
              <span class="font-mono">{{
                selectedDeployForRestart?.port
              }}</span>
            </div>
            <div class="flex justify-between">
              <span>{{ $t("deploysMonitoring.replicas") }}:</span>
              <span class="font-mono">{{
                selectedDeployForRestart?.containers
              }}</span>
            </div>
            <div class="flex justify-between">
              <span
                >{{
                  $t("deploysMonitoring.restart.confirmation.status")
                }}:</span
              >
              <span class="font-mono">{{
                getStatusTranslation(selectedDeployForRestart?.status)
              }}</span>
            </div>
          </div>
        </div>

        <!-- Advertencias -->
        <div
          class="mb-4 p-3 bg-warning/5 dark:bg-warning/10 rounded-lg border border-warning/20 dark:border-warning/30"
        >
          <div class="flex items-start gap-2">
            <e-icon name="warning" size="sm" color="text-warning" />
            <div>
              <h4
                class="text-body-3 font-medium text-warning dark:text-warning/90 mb-2"
              >
                {{
                  $t("deploysMonitoring.restart.confirmation.warnings.title")
                }}
              </h4>
              <ul
                class="text-caption-2 text-gray-700 dark:text-gray-300 space-y-1"
              >
                <li class="flex items-center gap-1">
                  <e-icon name="info" size="xs" color="text-warning" />
                  <span>{{
                    $t(
                      "deploysMonitoring.restart.confirmation.warnings.serviceInterruption"
                    )
                  }}</span>
                </li>
                <li class="flex items-center gap-1">
                  <e-icon name="info" size="xs" color="text-warning" />
                  <span>{{
                    $t(
                      "deploysMonitoring.restart.confirmation.warnings.connectionLoss"
                    )
                  }}</span>
                </li>
                <li class="flex items-center gap-1">
                  <e-icon name="info" size="xs" color="text-warning" />
                  <span>{{
                    $t(
                      "deploysMonitoring.restart.confirmation.warnings.recoveryTime"
                    )
                  }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Botones -->
        <div class="flex justify-end gap-3 py-1">
          <e-btn
            level="2"
            :text="$t('deploysMonitoring.restart.confirmation.cancel')"
            @click="closeRestartDialog"
            class="min-w-[120px]"
          />
          <e-btn
            level="1"
            :text="$t('deploysMonitoring.restart.confirmation.confirm')"
            iconName="sym-restart_alt"
            @click="restartDeploy"
            class="min-w-[160px]"
          />
        </div>
      </div>
    </template>
  </e-dialog>

  <!-- Diálogo de confirmación de reinicio de todos -->
  <e-dialog
    :show="showRestartDialogAll"
    bgColor="bg-white dark:bg-socrates-card-dark"
    :title="$t('deploysMonitoring.restart.confirmation.title')"
    @close="closeRestartDialogAll"
  >
    <template #content>
      <div class="w-[60vw] max-w-2xl max-h-[80vh] overflow-y-auto">
        <h4
          class="text-body-3 font-medium text-warning dark:text-warning/90 mb-2"
        >
          {{ $t("deploysMonitoring.restartAll.title") }}
        </h4>
        <!-- Advertencias -->
        <div
          class="mb-4 p-3 bg-warning/5 dark:bg-warning/10 rounded-lg border border-warning/20 dark:border-warning/30"
        >
          <div class="flex items-start gap-2">
            <e-icon name="warning" size="sm" color="text-warning" />
            <div>
              <h4
                class="text-body-3 font-medium text-warning dark:text-warning/90 mb-2"
              >
                {{
                  $t("deploysMonitoring.restart.confirmation.warnings.title")
                }}
              </h4>
              <ul
                class="text-caption-2 text-gray-700 dark:text-gray-300 space-y-1"
              >
                <li class="flex items-center gap-1">
                  <e-icon name="info" size="xs" color="text-warning" />
                  <span>{{
                    $t(
                      "deploysMonitoring.restart.confirmation.warnings.serviceInterruption"
                    )
                  }}</span>
                </li>
                <li class="flex items-center gap-1">
                  <e-icon name="info" size="xs" color="text-warning" />
                  <span>{{
                    $t(
                      "deploysMonitoring.restart.confirmation.warnings.connectionLoss"
                    )
                  }}</span>
                </li>
                <li class="flex items-center gap-1">
                  <e-icon name="info" size="xs" color="text-warning" />
                  <span>{{
                    $t(
                      "deploysMonitoring.restart.confirmation.warnings.recoveryTime"
                    )
                  }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Botones -->
        <div class="flex justify-end gap-3 py-1">
          <e-btn
            level="2"
            :text="$t('deploysMonitoring.restart.confirmation.cancel')"
            @click="showRestartDialogAll = false"
            class="min-w-[120px]"
          />
          <e-btn
            level="1"
            :text="$t('deploysMonitoring.restart.confirmation.confirm')"
            iconName="sym-restart_alt"
            @click="restartAllDeploys"
            class="min-w-[160px]"
          />
        </div>
      </div>
    </template>
  </e-dialog>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import { loading } from "@alexochihua/exos-library-components";
import ContentTpl from "@/layouts/ContentTpl.vue";
import { useDeployStore } from "@/stores/deploy";
import { useRouter } from "vue-router";
import { DateTime } from "luxon";
import { usePermissions } from "@/helpers/userPermissions";

const { t } = useI18n();
const router = useRouter();
const deployStore = useDeployStore();
const { canUpdate, canDelete, canCreate, canRestart } = usePermissions();

// Filtros reactivos (aplicados)
const filters = ref({
  name: null,
  status: null,
  minPort: null,
  maxPort: null,
});

// Filtros temporales (en el formulario)
const tempFilters = ref({
  name: null,
  status: null,
  minPort: null,
  maxPort: null,
});

// Búsqueda global
const globalSearch = ref(null);

// Referencia al dropdown de filtros
const filterDropdown = ref(null);

// Variables para el diálogo de reinicio
const showRestartDialog = ref(false);
const selectedDeployForRestart = ref(null);

// Variables para el diálogo de reinicio de todos
const showRestartDialogAll = ref(false);

const shouldPoll = ref(false);

// Opciones para el filtro de estado
const statusFilterOptions = computed(() => [
  { label: t("deploysMonitoring.filters.pendingStatus"), value: "pending" },
  { label: t("deploysMonitoring.filters.runningStatus"), value: "running" },
  { label: t("deploysMonitoring.filters.succeededStatus"), value: "succeeded" },
  { label: t("deploysMonitoring.filters.failedStatus"), value: "failed" },
  { label: t("deploysMonitoring.filters.unknownStatus"), value: "unknown" },
]);

// Opciones para el dropdown de acciones del deploy
const baseDeployActionOptions = [
  {
    label: t("deploysMonitoring.actions.edit"),
    value: 1,
    requiredPermission: { module: "deploy-monitoring", action: "edit" },
  },
  {
    label: t("deploysMonitoring.actions.delete"),
    value: 2,
    requiredPermission: { module: "deploy-monitoring", action: "delete" },
  },
];

const filteredDeployActionOptions = computed(() => {
  return baseDeployActionOptions.filter((option) => {
    const { module, action } = option.requiredPermission;

    if (module === "deploy-monitoring" && action === "edit") {
      return canUpdate("deploy-monitoring");
    }

    if (module === "deploy-monitoring" && action === "delete") {
      return canDelete("deploy-monitoring");
    }

    return false;
  });
});

// Variable local que consumirá los deploys del store y aplicará filtros
const filteredDeploys = computed(() => {
  let filtered = deployStore.deploys;

  // --- Búsqueda global ---
  if (globalSearch.value && typeof globalSearch.value === "string") {
    const search = globalSearch.value.toLowerCase();
    filtered = filtered.filter((d) => {
      // Buscar en nombre
      const nameMatch = d.name && d.name.toLowerCase().includes(search);
      // Buscar en puerto (convertir a string para búsqueda)
      const portMatch = d.port && d.port.toString().includes(search);
      // Buscar en estatus
      const statusMatch = d.status && d.status.toLowerCase().includes(search);
      // Buscar en la traducción del estatus
      const statusTranslationMatch = getStatusTranslation(d.status)
        .toLowerCase()
        .includes(search);

      return nameMatch || portMatch || statusMatch || statusTranslationMatch;
    });
  }

  // --- Filtro por nombre ---
  if (filters.value.name && typeof filters.value.name === "string") {
    const search = filters.value.name.toLowerCase();
    filtered = filtered.filter(
      (d) => d.name && d.name.toLowerCase().includes(search)
    );
  }

  // --- Filtro por estado ---
  if (filters.value.status) {
    filtered = filtered.filter((d) => d.status === filters.value.status);
  }

  // --- Filtro por rango de puerto ---
  if (filters.value.minPort !== null && filters.value.minPort !== "") {
    filtered = filtered.filter(
      (d) => (d.port || 0) >= parseInt(filters.value.minPort)
    );
  }
  if (filters.value.maxPort !== null && filters.value.maxPort !== "") {
    filtered = filtered.filter(
      (d) => (d.port || 0) <= parseInt(filters.value.maxPort)
    );
  }

  return filtered;
});

// Cargar los deploys al montar el componente
onMounted(async () => {
  window.scrollTo(0, 0);
  stopPolling();
  shouldPoll.value = true;
  loading.show({ project: "services" });
  try {
    await deployStore.fetchDeploys();
  } finally {
    loading.hide();
  }
});

const getStatusTranslation = (status) => {
  return t(`deploysMonitoring.status.${status}`);
};

const goToDeployDetail = async (deploy) => {
  shouldPoll.value = false;
  stopPolling();
  await deployStore.fetchDeployDetail(deploy.id);
  router.push({ name: "deploys-form" });
};

const handleActionSelected = (deploy, action) => {
  shouldPoll.value = false;
  stopPolling();
  if (action === 1) {
    goToDeployDetail(deploy);
  } else if (action === 2) {
    goToDeleteDeploy(deploy);
  }
};

const goToDeleteDeploy = async (deploy) => {
  shouldPoll.value = false;
  stopPolling();
  await deployStore.fetchDeployDetail(deploy.id);
  router.push({ name: "deploys-delete" });
};

const getCertStatus = (deploy) => {
  if (!deploy.cert?.file || !deploy.cert?.certExpiry) {
    return "no-cert";
  }

  const expiryDate = DateTime.fromISO(deploy.cert.certExpiry);
  const now = DateTime.now();

  if (expiryDate < now) {
    return "expired";
  } else if (expiryDate.diff(now, "days").days <= 7) {
    return "expiring";
  } else {
    return "valid";
  }
};

// Función para obtener el tiempo restante o transcurrido del certificado
const getCertTimeText = (deploy) => {
  if (!deploy.cert?.file || !deploy.cert?.certExpiry) {
    return "";
  }

  // Usar la fecha de expiración tal como está (sin endOf('day'))
  const expiryDate = DateTime.fromISO(deploy.cert.certExpiry);
  const now = DateTime.now();

  if (expiryDate < now) {
    // Certificado expirado
    const absDiff = now
      .diff(expiryDate, ["days", "months", "years"])
      .toObject();
    let timeText = "";

    if (absDiff.years && absDiff.years > 0) {
      timeText = `${t("deployForm.security.timeUnits.expiredAgo")} ${absDiff.years} ${absDiff.years > 1 ? t("deployForm.security.timeUnits.years") : t("deployForm.security.timeUnits.year")}`;
      if (absDiff.months && absDiff.months > 0) {
        timeText += `, ${absDiff.months} ${absDiff.months > 1 ? t("deployForm.security.timeUnits.months") : t("deployForm.security.timeUnits.month")}`;
      }
    } else if (absDiff.months && absDiff.months > 0) {
      timeText = `${t("deployForm.security.timeUnits.expiredAgo")} ${absDiff.months} ${absDiff.months > 1 ? t("deployForm.security.timeUnits.months") : t("deployForm.security.timeUnits.month")}`;
      if (absDiff.days && absDiff.days > 0) {
        timeText += `, ${Math.ceil(absDiff.days)} ${Math.ceil(absDiff.days) > 1 ? t("deployForm.security.timeUnits.days") : t("deployForm.security.timeUnits.day")}`;
      }
    } else {
      timeText = `${t("deployForm.security.timeUnits.expiredAgo")} ${Math.ceil(absDiff.days || 0)} ${Math.ceil(absDiff.days || 0) > 1 ? t("deployForm.security.timeUnits.days") : t("deployForm.security.timeUnits.day")}`;
    }
    return timeText;
  } else {
    // Certificado válido o por expirar
    const diff = expiryDate.diff(now, ["days", "months", "years"]).toObject();
    let timeText = "";

    if (diff.years && diff.years > 0) {
      timeText = `${diff.years} ${diff.years > 1 ? t("deployForm.security.timeUnits.years") : t("deployForm.security.timeUnits.year")}`;
      if (diff.months && diff.months > 0) {
        timeText += `, ${diff.months} ${diff.months > 1 ? t("deployForm.security.timeUnits.months") : t("deployForm.security.timeUnits.month")}`;
      }
    } else if (diff.months && diff.months > 0) {
      timeText = `${diff.months} ${diff.months > 1 ? t("deployForm.security.timeUnits.months") : t("deployForm.security.timeUnits.month")}`;
      if (diff.days && diff.days > 0) {
        const daysLeft = Math.max(0, Math.floor(diff.days));
        timeText += `, ${daysLeft} ${daysLeft === 1 ? t("deployForm.security.timeUnits.day") : t("deployForm.security.timeUnits.days")}`;
      }
    } else {
      const daysLeft = Math.max(0, Math.floor(diff.days || 0));
      timeText = `${daysLeft} ${daysLeft === 1 ? t("deployForm.security.timeUnits.day") : t("deployForm.security.timeUnits.days")}`;
    }
    return timeText;
  }
};

// Acción para ir al formulario de creación de deploy
const goToCreateDeploy = () => {
  shouldPoll.value = false;
  router.push({ name: "deploys-form" });
};

// Función para aplicar filtros
const applyFilters = () => {
  shouldPoll.value = false;
  filters.value = {
    name: tempFilters.value.name,
    status: tempFilters.value.status,
    minPort: tempFilters.value.minPort,
    maxPort: tempFilters.value.maxPort,
  };

  // Cerrar el dropdown usando el método closeDropdown
  if (filterDropdown.value) {
    filterDropdown.value.closeDropdown();
  }
};

// Función para limpiar filtros
const clearFilters = () => {
  shouldPoll.value = false;
  filters.value = {
    name: null,
    status: null,
    minPort: null,
    maxPort: null,
  };

  tempFilters.value = {
    name: null,
    status: null,
    minPort: null,
    maxPort: null,
  };
};

// Función para confirmar el reinicio del deploy
const confirmRestartDeploy = (deploy) => {
  shouldPoll.value = false;
  stopPolling();
  selectedDeployForRestart.value = deploy;
  showRestartDialog.value = true;
};

// Función para cerrar el diálogo de reinicio
const closeRestartDialog = () => {
  shouldPoll.value = false;
  stopPolling();
  showRestartDialog.value = false;
  selectedDeployForRestart.value = null;
};

// Función para cerrar el diálogo de reinicio
const closeRestartDialogAll = () => {
  showRestartDialogAll.value = false;
};

// Función para reiniciar el deploy
const restartDeploy = async () => {
  try {
    shouldPoll.value = false;
    stopPolling();
    loading.show({ project: "services" });
    await deployStore.restartDeploy(selectedDeployForRestart.value.id);
    loading.hide();

    // Cerrar el diálogo
    closeRestartDialog();

    // Mostrar mensaje de éxito (aquí podrías usar tu sistema de notificaciones)
    console.log(
      "Deploy reiniciado exitosamente:",
      selectedDeployForRestart.value?.name
    );
  } catch (error) {
    // Ocultar loading en caso de error
    loading.hide();
    console.error("Error al reiniciar el deploy:", error);
    // Aquí podrías mostrar un mensaje de error
  }
};

const restartAllDeploys = async () => {
  try {
    loading.show({ project: "services" });
    await deployStore.restartAllDeploys();
    loading.hide();
    closeRestartDialogAll();

    console.log(
      "Deploy reiniciado exitosamente:",
      selectedDeployForRestart.value?.name
    );
  } catch (error) {
    // Ocultar loading en caso de error
    loading.hide();
    console.error("Error al reiniciar el deploy:", error);
    // Aquí podrías mostrar un mensaje de error
  }
};

let timerId = null;

async function doRequest() {
  try {
    await deployStore.fetchDeploys();
  } catch (err) {
    if (err?.name === "AbortError") return;
    console.error("poll error:", err);
  }
}

function scheduleNext() {
  if (!shouldPoll.value) return;
  timerId = setTimeout(async () => {
    await doRequest();
    scheduleNext();
  }, 4000);
}

function startPolling() {
  if (timerId) return;
  doRequest().finally(scheduleNext);
}

function stopPolling() {
  clearTimeout(timerId);
  timerId = null;
}

watch(
  shouldPoll,
  (on) => {
    on ? startPolling() : stopPolling();
  },
  { immediate: true }
);
</script>

<style></style>
