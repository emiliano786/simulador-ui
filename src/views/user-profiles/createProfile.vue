<template>
  <content-tpl>
    <template #header-left>
      <span
        class="title-1 text-neutral-black dark:text-neutral-white border-l-[3px] border-primary pl-2"
      >
        {{ t('profiles.form.title') }}
      </span>
    </template>
    <template #main-content>
      <!-- Sección General -->
      <div class="flex flex-col h-fit gap-3">
        <e-card
          :label="
            isCreating
              ? t('profiles.form.general.titleCreateProfile')
              : t('profiles.form.general.titleUpdateProfile')
          "
        >
          <template #contentCard>
            <div class="mb-4">
              <p class="text-body-4 text-gray-600 dark:text-gray-400">
                {{
                  isCreating
                    ? t('profiles.form.general.decriptionCreateProfile')
                    : t('profiles.form.general.descriptionUpdateProfile')
                }}
              </p>
            </div>
            <e-form ref="formGeneral" @submit="handleUpdateProfileGeneral">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <e-input
                  v-model="formProfile.name"
                  :label="t('profiles.form.general.profileName')"
                  @clean="formProfile.name = null"
                  required
                />
                <e-input
                  v-model="formProfile.description"
                  :label="t('profiles.form.general.profileDescription')"
                  @clean="formProfile.description = null"
                  required
                />
                <e-select
                  required
                  :label="t('profiles.form.general.status')"
                  :options="catalogActive"
                  v-model="formProfile.status"
                  @clean="formProfile.status = null"
                />
              </div>
            </e-form>

            <div class="mt-8">
              <div class="flex justify-between mb-6">
                <h3 class="text-lg font-semibold">
                  {{ $t('profileCreation.form.permissions.title') }}
                </h3>
                <e-btn
                  level="3"
                  data-test="btn-open-modules"
                  :text="
                    openModules
                      ? t('profileCreation.form.permissions.hideAll')
                      : t('profileCreation.form.permissions.showAll')
                  "
                  @click="openCollapseModules"
                />
              </div>

              <div v-for="(module, key) in permissions" :key="key" class="mb-6">
                <e-collapse
                  ref="collapseRefs"
                  :over="false"
                  :text="$t(module.i18nKey)"
                  data-test="collaps"
                  @toggle="handleCollapseToggle(key)"
                  :open="selectedServiceIndex === key"
                >
                  <template #filter-collapse>
                    <div class="mt-2 pl-4">
                      <!-- Submódulos -->
                      <template v-if="module.submodules">
                        <div
                          v-for="(submodule, subIndex) in module.submodules"
                          :key="subIndex"
                          class="mb-4"
                        >
                          <h4 class="font-medium mb-2">
                            {{ $t(submodule.nameKey) }}
                          </h4>

                          <div class="space-y-2">
                            <div
                              v-for="(action, actionIndex) in submodule.actions"
                              :key="actionIndex"
                              class="flex items-center"
                            >
                              <e-checkbox
                                :modelValue="
                                  selectedPermissions[key]?.[submodule.name]?.actions?.includes(
                                    action
                                  )
                                "
                                @update:modelValue="
                                  (value) =>
                                    togglePermission(key, 'actions', action, value, submodule.name)
                                "
                                data-test="check-submodule"
                                size="1.5rem"
                                class="mr-2"
                              />
                              <span>{{ $t('actions.' + action) }}</span>
                            </div>
                          </div>
                        </div>
                      </template>

                      <!-- Módulos sin submódulos -->
                      <template v-else>
                        <div v-if="module.options && module.options.length > 0">
                          <h4 class="font-medium mb-2">
                            {{ $t('profileCreation.form.permissions.options') }}
                          </h4>
                          <div class="space-y-2">
                            <div
                              v-for="(option, index) in module.options"
                              :key="index"
                              class="flex items-center"
                            >
                              <e-checkbox
                                :modelValue="selectedPermissions[key]?.options?.includes(option)"
                                @update:modelValue="
                                  (value) => togglePermission(key, 'options', option, value)
                                "
                                data-test="check"
                                size="1.5rem"
                                class="mr-2"
                              />
                              <span>{{ $t('actions.' + option) }}</span>
                            </div>
                          </div>
                        </div>

                        <div v-if="module.actions && module.actions.length > 0" class="mt-4">
                          <h4 class="font-medium mb-2">
                            {{ $t('profileCreation.form.permissions.actions') }}
                          </h4>
                          <div class="space-y-2">
                            <div
                              v-for="(action, index) in module.actions"
                              :key="index"
                              class="flex items-center"
                            >
                              <e-checkbox
                                :modelValue="selectedPermissions[key]?.actions?.includes(action)"
                                @update:modelValue="
                                  (value) => togglePermission(key, 'actions', action, value)
                                "
                                data-test="check"
                                size="1.5rem"
                                class="mr-2"
                              />
                              <span>{{ $t('actions.' + action) }}</span>
                              <!-- etiqueta por i18n -->
                            </div>
                          </div>
                        </div>
                      </template>
                    </div>
                  </template>
                </e-collapse>
              </div>
            </div>
          </template>
        </e-card>
      </div>
    </template>
    <template #footer>
      <div class="flex gap-3 justify-end">
        <e-btn
          level="2"
          :text="t('profiles.form.actions.cancel')"
          @click="router.push({ name: 'user-profiles' })"
          width="w-[10rem] xxl:w-[12rem]"
          class="h-[2rem]"
        />
        <e-btn
          width="w-[10rem] xxl:w-[12rem]"
          class="h-[2rem]"
          :text="
            isCreating
              ? t('profiles.form.actions.createProfile')
              : t('profiles.form.actions.saveChanges')
          "
          :disabled="!isFormValid"
          @click="handleSubmit"
        />
      </div>
    </template>
  </content-tpl>

  <e-dialog
    :show="showDialog"
    bgColor="bg-white dark:bg-socrates-card-dark"
    :title="
      isCreating
        ? t('profiles.form.confirmation.createTitle')
        : t('profiles.form.confirmation.title')
    "
    @close="closeDialog"
  >
    <template #content>
      <div class="w-[60vw] max-w-2xl max-h-[80vh] overflow-y-auto">
        <!-- Información del perfil -->
        <div
          class="mb-4 p-3 bg-info-4 dark:bg-blue-900/20 rounded-lg border border-info-2 dark:border-blue-800"
        >
          <div class="flex items-center gap-2 mb-2">
            <e-icon name="info" size="sm" color="text-info dark:text-blue-400" />
            <h3 class="text-body-3 font-medium text-info-1 dark:text-blue-200">
              {{
                isCreating
                  ? t('profiles.form.confirmation.createInfoTitle')
                  : t('profiles.form.confirmation.infoTitle')
              }}
            </h3>
          </div>
          <p class="text-body-4 text-info-1 dark:text-blue-300">
            {{
              isCreating
                ? t('profiles.form.confirmation.createInfoMessage')
                : t('profiles.form.confirmation.infoMessage', { name: '' })
            }}
            <span
              class="font-mono font-bold text-info dark:text-info-2 text-body-3 px-1 bg-info-3 dark:bg-info/20 rounded"
            >
              {{ formProfile.name }} {{ formProfile.description }}
            </span>
            {{
              isCreating
                ? t('profiles.form.confirmation.createInfoMessageEnd')
                : t('profiles.form.confirmation.infoMessageEnd')
            }}
          </p>
        </div>

        <!-- Proceso técnico -->
        <div class="mb-4">
          <h4 class="text-body-3 font-medium text-gray-800 dark:text-gray-200 mb-2">
            {{
              isCreating
                ? t('profiles.form.confirmation.createProcessTitle')
                : t('profiles.form.confirmation.processTitle')
            }}
          </h4>
          <div class="space-y-2">
            <div class="flex items-start gap-2 p-2 bg-gray-200 dark:bg-gray-800 rounded-lg">
              <div
                class="flex-shrink-0 w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center text-xs font-medium"
              >
                1
              </div>
              <div>
                <h5 class="text-body-4 font-medium text-gray-800 dark:text-gray-200 mb-0.5">
                  {{ t('profiles.form.confirmation.steps.validation.title') }}
                </h5>
                <p class="text-caption-2 text-gray-600 dark:text-gray-400">
                  {{ t('profiles.form.confirmation.steps.validation.description') }}
                </p>
              </div>
            </div>

            <div class="flex items-start gap-2 p-2 bg-gray-200 dark:bg-gray-800 rounded-lg">
              <div
                class="flex-shrink-0 w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center text-xs font-medium"
              >
                2
              </div>
              <div>
                <h5 class="text-body-4 font-medium text-gray-800 dark:text-gray-200 mb-0.5">
                  {{
                    isCreating
                      ? t('profiles.form.confirmation.steps.createApplication.title')
                      : t('profiles.form.confirmation.steps.application.title')
                  }}
                </h5>
                <p class="text-caption-2 text-gray-600 dark:text-gray-400">
                  {{
                    isCreating
                      ? t('profiles.form.confirmation.steps.createApplication.description')
                      : t('profiles.form.confirmation.steps.application.description')
                  }}
                </p>
              </div>
            </div>

            <div class="flex items-start gap-2 p-2 bg-gray-200 dark:bg-gray-800 rounded-lg">
              <div
                class="flex-shrink-0 w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center text-xs font-medium"
              >
                3
              </div>
              <div>
                <h5 class="text-body-4 font-medium text-gray-800 dark:text-gray-200 mb-0.5">
                  {{ t('profiles.form.confirmation.steps.verification.title') }}
                </h5>
                <p class="text-caption-2 text-gray-600 dark:text-gray-400">
                  {{ t('profiles.form.confirmation.steps.verification.description') }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Botones de acción -->
        <div class="flex justify-end gap-3 py-1">
          <e-btn
            level="2"
            :text="t('profiles.form.actions.cancel')"
            @click="closeDialog"
            class="min-w-[120px]"
          />
          <e-btn
            level="1"
            :text="
              isCreating
                ? t('profiles.form.actions.createProfile')
                : t('profiles.form.actions.updateProfile')
            "
            iconName="update"
            @click="isCreating ? handleCreateProfile() : handleUpdateProfile()"
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
          <h3 class="text-title-2 font-bold text-positive dark:text-positive/90 mb-3 text-center">
            {{
              isCreating ? t('profiles.form.success.createTitle') : t('profiles.form.success.title')
            }}
          </h3>

          <!-- Mensaje descriptivo -->
          <p class="text-body-3 text-gray-700 dark:text-gray-300 text-center mb-6 leading-relaxed">
            {{
              isCreating
                ? t('profiles.form.success.createMessage')
                : t('profiles.form.success.message', { name: '' })
            }}
            <span
              class="font-mono font-bold text-primary dark:text-primary-2 text-body-2 px-2 py-1 bg-primary/10 dark:bg-primary/20 rounded-lg border border-primary/20 dark:border-primary/30 shadow-sm"
            >
              {{ formProfile.name }} {{ formProfile.description }}
            </span>
            {{
              isCreating
                ? t('profiles.form.success.createMessageEnd')
                : t('profiles.form.success.messageEnd')
            }}
          </p>

          <!-- Información adicional -->
          <div
            class="w-full bg-positive/5 dark:bg-positive/10 rounded-lg p-4 mb-6 border border-positive/20 dark:border-positive/30"
          >
            <div class="flex items-center gap-2 mb-2">
              <e-icon name="verified" size="sm" color="text-positive" />
              <span class="text-body-3 text-positive dark:text-positive/90">
                {{
                  isCreating
                    ? t('profiles.form.success.createChangesApplied')
                    : t('profiles.form.success.changesApplied')
                }}
              </span>
            </div>
            <ul class="text-caption-2 text-gray-600 dark:text-gray-400 space-y-1 ml-4">
              <li class="flex items-center gap-1">
                <e-icon name="check_circle" size="xs" color="text-positive" />
                <span>{{
                  isCreating
                    ? t('profiles.form.success.createChanges.general')
                    : t('profiles.form.success.changes.general')
                }}</span>
              </li>
              <li class="flex items-center gap-1">
                <e-icon name="check_circle" size="xs" color="text-positive" />
                <span>{{
                  isCreating
                    ? t('profiles.form.success.createChanges.credentials')
                    : t('profiles.form.success.changes.credentials')
                }}</span>
              </li>
            </ul>
          </div>

          <!-- Botón de acción -->
          <div class="w-full">
            <e-btn
              level="1"
              :text="t('profiles.form.actions.continue')"
              iconName="sym-arrow_forward"
              @click="closeSuccessDialog"
              class="w-full h-12 text-body-2 font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            />
          </div>

          <!-- Nota adicional -->
          <p class="text-caption-2 text-gray-500 dark:text-gray-400 text-center mt-4">
            {{ t('profiles.form.success.redirectNote') }}
          </p>
        </div>
      </div>
    </template>
  </e-dialog>
</template>

<script setup>
  import { ref, computed, reactive, watch, onMounted, onBeforeUnmount } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRouter } from 'vue-router';
  import { loading } from '@alexochihua/exos-library-components';
  import ContentTpl from '@/layouts/ContentTpl.vue';
  import { useProfilesStore } from '@/stores/user-profiles';

  const { t } = useI18n();
  const router = useRouter();
  const profilesStore = useProfilesStore();
  const openModules = ref(false);
  const collapseRefs = ref([]);

  // Determinar si estamos creando o actualizando un perfil
  const isCreating = computed(() => !profilesStore.selectedProfile);

  // Formulario reactivo
  const formProfile = reactive({
    name: '',
    description: '',
    status: true
  });

  const MODULE_SLUG = {
    DeployManager: 'deploy-monitoring',
    User: 'users',
    Profiles: 'profiles'
  };

  const validatedFormsProfile = ref({
    general: false
  });

  const catalogActive = computed(() => [
    { label: t('profiles.form.general.active'), value: true },
    { label: t('profiles.form.general.inactive'), value: false }
  ]);

  // Ref para los formularios
  const formGeneral = ref(null);

  const showDialog = ref(false);
  const showSuccessDialog = ref(false);

  // Llenar los campos con la info del selectedProfile
  const selectedProfile = computed(() => profilesStore.selectedProfile);

  onMounted(() => {
    Object.keys(permissions.value).forEach((k) => {
      if (!selectedPermissions[k]) selectedPermissions[k] = { actions: [] };
    });
  });

  const openCollapseModules = () => {
    openModules.value = !openModules.value;
    collapseRefs.value.forEach((modulo) => {
      openModules.value ? modulo.show() : modulo.hide();
    });

    if (!openModules.value) {
      selectedServiceIndex.value = null;
    }
  };

  // Método para ejecutar el submit del formulario
  const handleSubmit = () => {
    formGeneral.value.submit();

    // Verificar si el formulario es válido
    if (validatedFormsProfile.value.general) {
      openDialog();
    }
  };

  const handleUpdateProfileGeneral = (data) => {
    validatedFormsProfile.value.general = data;
  };

  const openDialog = () => {
    showDialog.value = true;
  };

  const closeDialog = () => {
    showDialog.value = false;
  };

  const handleUpdateProfile = async () => {
    try {
      loading.show({ project: 'services' });

      const orig = selectedProfile.value;
      const id = orig?.id;

      const payload = {
        id,
        ...(formProfile.name?.trim() ? { name: formProfile.name.trim() } : {}),
        ...(formProfile.description?.trim() ? { description: formProfile.description.trim() } : {}),
        ...(typeof formProfile.status === 'boolean' ? { active: !!formProfile.status } : {}),
        ...(() => {
          const perms = buildPermissionsForApi(selectedPermissions);
          return perms.length ? { permissions: perms } : {};
        })()
      };

      const hasUpdatable = ['name', 'description', 'active', 'permissions'].some(
        (k) => k in payload
      );
      if (!hasUpdatable) throw new Error('Debe incluir al menos un campo a actualizar');

      await profilesStore.updateProfile(payload);

      loading.hide();
      closeDialog();
      showSuccessDialog.value = true;
    } catch (err) {
      loading.hide();
      console.error('Error al actualizar el perfil:', err);
    }
  };

  // Función para cerrar el diálogo de éxito y navegar
  const closeSuccessDialog = () => {
    showSuccessDialog.value = false;
    router.push({ name: 'user-profiles' });
  };

  function buildPermissions() {
    const out = [];
    for (const [key, sel] of Object.entries(selectedPermissions)) {
      const acts = [...new Set(sel.actions || [])];
      if (acts.length) out.push({ module: MODULE_SLUG[key] || key.toLowerCase(), actions: acts });
    }
    return out;
  }
  function pickDefaultRoute(perms) {
    return perms.find((p) => p.module === 'users')?.module || perms[0]?.module || 'users';
  }

  function buildPermissionsForApi(selectedPermissions) {
    const out = [];
    for (const [uiKey, sel] of Object.entries(selectedPermissions)) {
      const actions = [...new Set(sel?.actions || [])];
      if (!actions.length) continue;
      out.push({ module: MODULE_SLUG[uiKey] || uiKey.toLowerCase(), actions });
    }
    return out;
  }

  // Función para crear el perfil
  const handleCreateProfile = async () => {
    try {
      loading.show({ project: 'services' });

      const permissionsForApi = buildPermissions();
      const payload = {
        name: (formProfile.name || '').trim(),
        description: (formProfile.description || '').trim(),
        default_route: pickDefaultRoute(permissionsForApi),
        active: !!formProfile.status,
        permissions: permissionsForApi
      };

      console.log('Payload para crear perfil:', payload);

      await profilesStore.createProfile(payload);

      loading.hide();
      closeDialog();
      showSuccessDialog.value = true;
    } catch (error) {
      loading.hide();
      console.error('Error al crear el perfil:', error);
    }
  };

  onBeforeUnmount(() => {
    profilesStore.clearSelectedProfile();
  });

  const permissions = ref({
    DeployManager: {
      id: 20,
      moduleType: 1,
      i18nKey: 'modules.manage',
      actions: ['add', 'list', 'edit', 'restart', 'delete']
    },
    User: {
      id: 21,
      moduleType: 1,
      i18nKey: 'modules.user',
      actions: ['add', 'list', 'edit', 'delete']
    },
    Profiles: {
      id: 22,
      moduleType: 1,
      i18nKey: 'modules.profiles',
      actions: ['add', 'list', 'edit', 'delete']
    }
  });

  const selectedPermissions = reactive({
    DeployManager: {
      actions: []
    },
    User: {
      actions: []
    },
    Profiles: {
      actions: []
    }
  });

  const MODULE_MAP = {
    'deploy-monitoring': 'DeployManager',
    users: 'User',
    profiles: 'Profiles'
  };

  watch(
    selectedProfile,
    (newProfile) => {
      if (newProfile) {
        formProfile.name = newProfile.name || '';
        formProfile.description = newProfile.description || '';
        formProfile.status = newProfile.status ?? true;

        Object.keys(selectedPermissions).forEach((k) => {
          selectedPermissions[k].actions = [];
          Object.keys(selectedPermissions[k]).forEach((subKey) => {
            if (subKey !== 'actions' && subKey !== 'options') {
              delete selectedPermissions[k][subKey];
            }
          });
        });

        if (Array.isArray(newProfile.permissions)) {
          newProfile.permissions.forEach((p) => {
            const key = MODULE_MAP[p.module];
            if (key && selectedPermissions[key]) {
              selectedPermissions[key].actions = [...p.actions];
            }
          });
        }
      } else {
        profilesStore.clearSelectedProfile();
        Object.keys(selectedPermissions).forEach((k) => {
          selectedPermissions[k].actions = [];
        });
      }
    },
    { immediate: true, deep: true }
  );

  const DEPENDS_ON = {
    add: ['list'],
    edit: ['list'],
    restart: ['list'],
    delete: ['list']
  };

  const togglePermission = (moduleKey, type, value, checked, submoduleName = null) => {
    let arr;
    if (submoduleName) {
      if (!selectedPermissions[moduleKey][submoduleName]) {
        selectedPermissions[moduleKey][submoduleName] = { actions: [] };
      }
      arr = selectedPermissions[moduleKey][submoduleName].actions;
    } else {
      arr = selectedPermissions[moduleKey][type];
    }

    if (checked) {
      if (!arr.includes(value)) {
        arr.push(value);
      }

      if (DEPENDS_ON[value]) {
        DEPENDS_ON[value].forEach((dep) => {
          if (!arr.includes(dep)) {
            arr.push(dep);
          }
        });
      }
    } else {
      const index = arr.indexOf(value);
      if (index > -1) {
        arr.splice(index, 1);
      }
    }
  };

  const isFormValid = computed(() => {
    return (
      formProfile.name &&
      formProfile.description &&
      formProfile.status !== null &&
      formProfile.status !== undefined
    );
  });
</script>
