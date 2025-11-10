<template>
  <content-tpl>
    <template #header-left>
      <span
        class="title-1 text-neutral-black dark:text-neutral-white border-l-[3px] border-primary pl-2"
      >
        {{ t('users.form.title') }}
      </span>
    </template>
    <template #main-content>
      <!-- Sección General -->
      <div class="flex flex-col h-fit gap-3">
        <e-card :label="t('users.form.general.title')">
          <template #contentCard>
            <div class="mb-4">
              <p class="text-body-4 text-gray-600 dark:text-gray-400">
                {{ t('users.form.general.description') }}
              </p>
            </div>
            <e-form ref="formGeneral" @submit="handleUpdateProfileGeneral">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <e-input
                  v-model="formProfile.name"
                  :label="t('users.form.general.name')"
                  @clean="formProfile.name = null"
                  required
                />
                <e-input
                  v-model="formProfile.lastname"
                  :label="t('users.form.general.lastname')"
                  @clean="formProfile.lastname = null"
                  required
                />
                <e-input
                  v-model="formProfile.email"
                  :label="t('users.form.general.email')"
                  type="email"
                  @clean="formProfile.email = null"
                  :required="!isCreating"
                  :disabled="!isCreating"
                />
                <e-input
                  v-model="formProfile.password"
                  :label="t('users.form.general.password')"
                  type="password"
                  :disabled="!isCreating"
                  @clean="formProfile.password = null"
                  :required="isCreating"
                />
                <e-input
                  v-model="formProfile.username"
                  :label="t('users.form.general.username')"
                  @clean="formProfile.username = null"
                  required
                />
                <e-select
                  v-model="formProfile.profile"
                  :options="profileOptions"
                  :label="t('users.form.general.profile')"
                  required
                />
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
          :text="t('users.form.actions.cancel')"
          @click="router.push({ name: 'profiles-query' })"
          width="w-[10rem] xxl:w-[12rem]"
          class="h-[2rem]"
        />
        <e-btn
          width="w-[10rem] xxl:w-[12rem]"
          class="h-[2rem]"
          :text="
            isCreating
              ? t('users.createUser')
              : t('users.form.actions.saveChanges')
          "
          :disabled="isCreating ?
            !formProfile.name ||
            !formProfile.lastname ||
            !formProfile.username ||
            !formProfile.profile||
            !formProfile.email ||
            !formProfile.password
             :
            !formProfile.name ||
            !formProfile.lastname ||
            !formProfile.username ||
            !formProfile.profile||
            !formProfile.email 
          "
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
        ? t('users.form.confirmation.createTitle')
        : t('users.form.confirmation.title')
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
                  ? t('users.form.confirmation.createInfoTitle')
                  : t('users.form.confirmation.infoTitle')
              }}
            </h3>
          </div>
          <p class="text-body-4 text-info-1 dark:text-blue-300">
            {{
              isCreating
                ? t('users.form.confirmation.createInfoMessage')
                : t('users.form.confirmation.infoMessage', { name: '' })
            }}
            <span
              class="font-mono font-bold text-info dark:text-info-2 text-body-3 px-1 bg-info-3 dark:bg-info/20 rounded"
            >
              {{ formProfile.name }} {{ formProfile.lastname }}
            </span>
            {{
              isCreating
                ? t('users.form.confirmation.createInfoMessageEnd')
                : t('users.form.confirmation.infoMessageEnd')
            }}
          </p>
        </div>

        <!-- Proceso técnico -->
        <div class="mb-4">
          <h4 class="text-body-3 font-medium text-gray-800 dark:text-gray-200 mb-2">
            {{
              isCreating
                ? t('users.form.confirmation.createProcessTitle')
                : t('users.form.confirmation.processTitle')
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
                  {{ t('users.form.confirmation.steps.validation.title') }}
                </h5>
                <p class="text-caption-2 text-gray-600 dark:text-gray-400">
                  {{ t('users.form.confirmation.steps.validation.description') }}
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
                      ? t('users.form.confirmation.steps.createApplication.title')
                      : t('users.form.confirmation.steps.application.title')
                  }}
                </h5>
                <p class="text-caption-2 text-gray-600 dark:text-gray-400">
                  {{
                    isCreating
                      ? t('users.form.confirmation.steps.createApplication.description')
                      : t('users.form.confirmation.steps.application.description')
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
                  {{ t('users.form.confirmation.steps.verification.title') }}
                </h5>
                <p class="text-caption-2 text-gray-600 dark:text-gray-400">
                  {{ t('users.form.confirmation.steps.verification.description') }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Botones de acción -->
        <div class="flex justify-end gap-3 py-1">
          <e-btn
            level="2"
            :text="t('users.form.actions.cancel')"
            @click="closeDialog"
            class="min-w-[120px]"
          />
          <e-btn
            level="1"
            :text="
              isCreating
                ? t('users.form.actions.createuser')
                : t('users.form.actions.updateuser')
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
              isCreating ? t('users.form.success.createTitle') : t('users.form.success.title')
            }}
          </h3>

          <!-- Mensaje descriptivo -->
          <p class="text-body-3 text-gray-700 dark:text-gray-300 text-center mb-6 leading-relaxed">
            {{
              isCreating
                ? t('users.form.success.createMessage')
                : t('users.form.success.message', { name: '' })
            }}
            <span
              class="font-mono font-bold text-primary dark:text-primary-2 text-body-2 px-2 py-1 bg-primary/10 dark:bg-primary/20 rounded-lg border border-primary/20 dark:border-primary/30 shadow-sm"
            >
              {{ formProfile.name }} {{ formProfile.lastname }}
            </span>
            {{
              isCreating
                ? t('users.form.success.createMessageEnd')
                : t('users.form.success.messageEnd')
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
                    ? t('users.form.success.createChangesApplied')
                    : t('users.form.success.changesApplied')
                }}
              </span>
            </div>
            <ul class="text-caption-2 text-gray-600 dark:text-gray-400 space-y-1 ml-4">
              <li class="flex items-center gap-1">
                <e-icon name="check_circle" size="xs" color="text-positive" />
                <span>{{
                  isCreating
                    ? t('users.form.success.createChanges.general')
                    : t('users.form.success.changes.general')
                }}</span>
              </li>
              <li class="flex items-center gap-1">
                <e-icon name="check_circle" size="xs" color="text-positive" />
                <span>{{
                  isCreating
                    ? t('users.form.success.createChanges.credentials')
                    : t('users.form.success.changes.credentials')
                }}</span>
              </li>
            </ul>
          </div>

          <!-- Botón de acción -->
          <div class="w-full">
            <e-btn
              level="1"
              :text="t('users.form.actions.continue')"
              iconName="sym-arrow_forward"
              @click="closeSuccessDialog"
              class="w-full h-12 text-body-2 font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            />
          </div>

          <!-- Nota adicional -->
          <p class="text-caption-2 text-gray-500 dark:text-gray-400 text-center mt-4">
            {{ t('users.form.success.redirectNote') }}
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
  import { useProfilesStore as profilesStoreUser } from '@/stores/user-profiles';
  import { useProfilesStore } from '@/stores/profiles';

  const { t } = useI18n();
  const router = useRouter();
  const profilesStore = useProfilesStore();
  const userProfileStore = profilesStoreUser();

  // Determinar si estamos creando o actualizando un perfil
  const isCreating = computed(() => !profilesStore.selectedProfile);

  // Opciones para el tipo de usuario
  const profileOptions = computed(() =>
      userProfileStore.profiles.map((p) => ({
      label: p.name,
      value: p._id
    }))
  );

  // Formulario reactivo
  const formProfile = reactive({
    name: '',
    lastname: '',
    username: '',
    password: null,
    profile: null,
    email: ''
  });

  const validatedFormsProfile = ref({
    general: false
  });

  // Ref para los formularios
  const formGeneral = ref(null);

  const showDialog = ref(false);
  const showSuccessDialog = ref(false);

  // Llenar los campos con la info del selectedProfile
  const selectedProfile = computed(() => profilesStore.selectedProfile);

  onMounted(() => {
    userProfileStore.listProfiles({ active: true });

    if (selectedProfile.value) {
      formProfile.name = selectedProfile.value.name || '';
      formProfile.lastname = selectedProfile.value.lastname || '';
      formProfile.username = selectedProfile.value.username || '';
      formProfile.password = selectedProfile.value.password || null;
      formProfile.profile = selectedProfile.value.profile || null;
      formProfile.email = selectedProfile.value.email || '';
    } else {
      profilesStore.clearSelectedProfile();
    }
  });

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

      await profilesStore.updateProfile(selectedProfile.value.id, { ...formProfile });

      loading.hide();
      closeDialog();
      showSuccessDialog.value = true;
    } catch (error) {
      // Ocultar loading en caso de error
      loading.hide();
      console.error('Error al actualizar el perfil:', error);
      // Aquí podrías mostrar un mensaje de error
    }
  };

  const closeSuccessDialog = () => {
    showSuccessDialog.value = false;
    router.push({ name: 'profiles-query' });
  };

  const handleCreateProfile = async () => {
    try {
      loading.show({ project: 'services' });
      await profilesStore.createProfile(formProfile);

      loading.hide();
      closeDialog();
      showSuccessDialog.value = true;

      return true;
    } catch (error) {
      // Ocultar loading en caso de error
      loading.hide();
      console.error('Error al crear el perfil:', error);
      // Aquí podrías mostrar un mensaje de error
    }
  };

  onBeforeUnmount(() => {
    profilesStore.clearSelectedProfile();
  });
</script>
