<template>
  <content-tpl>
    <template #header-left>
      <span
        class="title-1 text-neutral-black dark:text-neutral-white border-l-[3px] border-primary pl-2"
      >
        {{ t('deployForm.title') }}
      </span>
    </template>
    <template #main-content>
      <div class="flex flex-col gap-3">
        <!-- Sección de Confirmación de Eliminación -->
        <e-card :label="t('deployForm.delete.title')" bgColor="dark:bg-socrates-card-dark">
          <template #contentCard>
            <!-- Información del Deploy a Eliminar -->
            <div v-if="selectedDeploy" class="mb-6 p-4">
              <div class="flex items-start gap-3">
                <div class="flex-shrink-0">
                  <div
                    class="w-10 h-10 bg-red-100 dark:bg-red-800 rounded-full flex items-center justify-center"
                  >
                    <svg
                      class="w-5 h-5 text-red-600 dark:text-red-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <div class="flex-1">
                  <h3 class="text-body-2 text-red-700 dark:text-red-300 mb-2 text-body-3">
                    {{ t('deployForm.delete.deployToDelete') }}:
                    <span
                      class="text-red-900 dark:text-red-100 text-body-2 bg-red-100 dark:bg-red-800 px-2 py-1 rounded"
                      >{{ selectedDeploy.name }}</span
                    >
                  </h3>

                  <!-- Detalles del Deploy -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div class="flex items-center gap-2">
                      <span class="text-red-700 dark:text-red-300 text-body-3"
                        >{{ t('deployForm.general.port') }}:</span
                      >
                      <span
                        class="text-body-2 bg-red-100 dark:bg-red-800 px-2 py-1 rounded text-red-800 dark:text-red-200"
                      >
                        {{ selectedDeploy.port }}
                      </span>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="text-red-700 dark:text-red-300 text-body-3"
                        >{{ t('deployForm.general.replicas') }}:</span
                      >
                      <span
                        class="text-body-2 bg-red-100 dark:bg-red-800 px-2 py-1 rounded text-red-800 dark:text-red-200"
                      >
                        {{ selectedDeploy.containers }}
                      </span>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="text-red-700 dark:text-red-300 text-body-3"
                        >{{ t('deployForm.delete.status') }}:</span
                      >
                      <div
                        class="max-w-1/3 w-fit px-2 h-fit flex items-center gap-1 border rounded-2xl justify-center backdrop-blur-sm"
                        :class="{
                          'border-warning bg-gradient-to-r from-warning/20 via-warning/15 to-warning/10':
                            selectedDeploy.status === 'pending',
                          'border-positive bg-gradient-to-r from-positive/20 via-positive/15 to-positive/10':
                            selectedDeploy.status === 'running',
                          'border-blue-500 bg-gradient-to-r from-blue-100 via-blue-50 to-blue-50':
                            selectedDeploy.status === 'succeeded',
                          'border-danger bg-gradient-to-r from-danger/20 via-danger/15 to-danger/10':
                            selectedDeploy.status === 'failed',
                          'border-gray-400 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-50':
                            selectedDeploy.status === 'unknown'
                        }"
                      >
                        <span>
                          <e-icon
                            size=".8rem"
                            name="sym-fiber_manual_record"
                            :class="{
                              'text-warning': selectedDeploy.status === 'pending',
                              'text-positive': selectedDeploy.status === 'running',
                              'text-blue-500': selectedDeploy.status === 'succeeded',
                              'text-danger blink': selectedDeploy.status === 'failed',
                              'text-gray-400': selectedDeploy.status === 'unknown'
                            }"
                          />
                        </span>
                        <span
                          class="text-body-3"
                          :class="{
                            'text-blue-500': selectedDeploy.status === 'succeeded',
                            'text-gray-400': selectedDeploy.status === 'unknown'
                          }"
                        >
                          {{ getStatusLabel(selectedDeploy.status) }}
                        </span>
                      </div>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="text-red-700 dark:text-red-300 text-body-3"
                        >{{ t('deployForm.delete.tls') }}:</span
                      >
                      <div
                        class="px-2 py-1 rounded-lg text-body-3 flex items-center gap-1"
                        :class="{
                          'bg-info-4 text-info-1 border border-info-2 dark:bg-info/20 dark:text-info-2 dark:border-info-30':
                            selectedDeploy.tlsEnabled,
                          'bg-gray-100 text-gray-600 border border-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600':
                            !selectedDeploy.tlsEnabled
                        }"
                      >
                        <e-icon
                          :name="selectedDeploy.tlsEnabled ? 'lock' : 'lock_open'"
                          size="xs"
                        />
                        {{
                          selectedDeploy.tlsEnabled
                            ? t('deployForm.delete.tlsActive')
                            : t('deployForm.delete.tlsInactive')
                        }}
                      </div>
                    </div>
                  </div>

                  <!-- Layout del Deploy -->
                  <div
                    v-if="selectedDeploy.layout"
                    class="mt-3 pt-3 border-t border-red-200 dark:border-red-700"
                  >
                    <div class="flex items-center gap-2 mb-2">
                      <span class="text-red-700 dark:text-red-300 text-body-3"
                        >{{ t('deployForm.delete.layout') }}:</span
                      >
                      <span
                        class="text-red-800 dark:text-red-200 text-body-2 bg-red-100 dark:bg-red-800 px-2 py-1 rounded"
                      >
                        {{ selectedDeploy.layout.name }}
                      </span>
                    </div>
                    <div class="flex flex-wrap gap-1">
                      <span class="text-xs text-red-600 dark:text-red-400">
                        {{ selectedDeploy.layout.dataElements?.length || 0 }}
                        {{ t('deployForm.delete.dataElements') }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Mensaje de Advertencia -->
            <div class="mb-6">
              <p class="text-body-4 text-gray-600 dark:text-neutral-white">
                {{ t('deployForm.delete.warningMessage') }}
              </p>
              <p class="text-body-4 text-gray-600 dark:text-neutral-white mt-2">
                {{ t('deployForm.delete.alternativeMessage') }}
              </p>
            </div>

            <!-- Formulario de Confirmación -->
            <e-form ref="formDelete" @submit="handleSubmitDelete">
              <div class="mb-6">
                <label class="block text-body-4 text-gray-600 dark:text-neutral-white mb-2">
                  {{ t('deployForm.delete.confirmationLabel') }}
                  <span
                    class="text-body-3 bg-neutral-700 dark:bg-neutral-300 px-1 py-0.5 rounded text-neutral-white dark:text-neutral-black"
                  >
                    {{ t('deployForm.delete.confirmationText') }}
                  </span>
                  {{ t('deployForm.delete.confirmationSuffix') }}
                </label>
                <e-input
                  v-model="confirmText"
                  :label="t('deployForm.delete.confirmationInputLabel')"
                  class="w-full md:w-1/2"
                  @clean="confirmText = null"
                />
              </div>

              <!-- Botones de Acción -->
              <div class="flex gap-3 justify-end">
                <e-btn
                  level="2"
                  :text="t('deployForm.actions.cancel')"
                  @click="handleCancel"
                  width="w-[10rem] xxl:w-[12rem]"
                  class="h-[2rem]"
                />
                <e-btn
                  level="1"
                  :text="t('deployForm.delete.deleteButton')"
                  :disabled="!isDeleteEnabled"
                  @click="handleDeleteDeploy"
                  width="w-[10rem] xxl:w-[12rem]"
                  class="h-[2rem]"
                />
              </div>
            </e-form>
          </template>
        </e-card>
      </div>
    </template>
  </content-tpl>

    <e-dialog
    :show="showSuccessDialog"
    bgColor="bg-white dark:bg-socrates-card-dark"
    @close="closeSuccessDialog"
  >
    <template #content>
      <div class="w-[60vw] max-w-md max-h-[80vh] overflow-y-auto">
        <div class="flex flex-col items-center justify-center py-8 px-6">
          <!-- Ícono -->
          <div class="mb-6">
            <div
              :class="[
                'w-20 h-20 rounded-full flex items-center justify-center animate-pulse',
                deleteSuccess ? 'bg-positive/20' : 'bg-danger/20'
              ]"
            >
              <e-icon
                :name="deleteSuccess ? 'sym-task_alt' : 'error'"
                size="3rem"
                :color="deleteSuccess ? 'text-positive' : 'text-danger'"
                class="animate-bounce"
              />
            </div>
          </div>

          <!-- Título -->
          <h3
            :class="[
              'text-title-2 font-bold mb-3 text-center',
              deleteSuccess
                ? 'text-positive dark:text-positive/90'
                : 'text-danger dark:text-danger/90'
            ]"
          >
            {{
              deleteSuccess
                ? t('profiles.form.success.deleteTitle')
                : t('profiles.form.failed.deleteTitle')
            }}
          </h3>

          <!-- Mensaje -->
          <p class="text-body-3 text-gray-700 dark:text-gray-300 text-center mb-6 leading-relaxed">
            <template v-if="deleteSuccess">
              {{ t('deploys.successDelete') }}
              <span
                class="font-mono font-bold text-primary dark:text-primary-2 text-body-2 px-2 py-1 bg-primary/10 dark:bg-primary/20 rounded-lg border border-primary/20 dark:border-primary/30 shadow-sm"
              >
                 {{ selectedDeploy.name }}
              </span>
            </template>
            <template v-else>
              {{ t('profiles.form.failed.deleteMessage') }}
              <span
                class="font-mono font-bold text-danger dark:text-danger-2 text-body-2 px-2 py-1 bg-danger/10 dark:bg-danger/20 rounded-lg border border-danger/20 dark:border-danger/30 shadow-sm"
              >
                {{ selectedDeploy.name }}
              </span>
              <span v-if="deleteErrorMsg" class="block mt-2 text-caption-2 text-gray-500">
                {{ t('deploys.errorDetail', { msg: deleteErrorMsg }) }}
              </span>
            </template>
          </p>

          <!-- Botón -->
          <div class="w-full">
            <e-btn
              level="1"
              :text="t('profiles.form.actions.continue')"
              iconName="sym-arrow_forward"
              @click="closeSuccessDialog"
              class="w-full h-12 text-body-2 font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            />
          </div>

          <p class="text-caption-2 text-gray-500 dark:text-gray-400 text-center mt-4">
            {{ t('deploys.redirectNote') }}
          </p>
        </div>
      </div>
    </template>
  </e-dialog>
</template>

<script setup>
  import { ref, computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useDeployStore } from '@/stores/deploy';
  import ContentTpl from '@/layouts/ContentTpl.vue';
  import { useRouter } from 'vue-router';

  const { t } = useI18n();
  const deployStore = useDeployStore();
  const router = useRouter();

  const formDelete = ref(null);

  const confirmText = ref(null);

  const showSuccessDialog = ref(false);
  const deleteSuccess = ref(false);

  const selectedDeploy = computed(() => deployStore.selectedDeploy);
  const isDeleteEnabled = computed(() => {
    return confirmText.value === t('deployForm.delete.confirmationText');
  });

  const handleDeleteDeploy = () => {
    if (confirmText.value === t('deployForm.delete.confirmationText') && selectedDeploy.value) {
      formDelete.value.submit();
    }
  };

  const handleSubmitDelete = async () => {
    try {      
      await deployStore.deleteDeploy(selectedDeploy.value.id);
      deleteSuccess.value = true;
      showSuccessDialog.value = true;
    } catch (error) {
      deleteSuccess.value = false;
      showSuccessDialog.value = true;
      console.error('Error al querer eliminar');
      console.log(error);
    }
  };

  const handleCancel = () => {
    router.push({ name: 'deploys-query' });
  };

  const closeSuccessDialog = () => {
    showSuccessDialog.value = false;
    deleteSuccess.value = false;
    deployStore.selectedDeploy = null
    router.push({ name: 'deploys-query' });
  };

  // Función para obtener el label del estado
  const getStatusLabel = (status) => {
    return t(`deploysMonitoring.status.${status}`);
  };
</script>
