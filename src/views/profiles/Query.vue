<template>
  <content-tpl>
    <template #top-left>
      <div class="flex flex-col gap-1 flex-1">
        <span
          class="title-1 text-neutral-black dark:text-neutral-white border-l-[3px] border-primary pl-2"
        >
          {{ $t('users.title') }}
        </span>
        <span class="text-body-4 text-neutralGrey dark:text-neutralLightGrey">
          {{ $t('users.description') }}
        </span>
      </div>
    </template>
    <template #top-right>
      <div class="flex items-center justify-end w-full">
        <e-btn
          v-if="canCreate('users')"
          rounded
          color="bg-primary hover:bg-primary/80 dark:bg-socrates-main-dark dark:hover:bg-socrates-main-dark/80"
          @click="goToCreateProfile"
        >
          <template #content>
            <div class="flex justify-center items-center gap-1 w-36 h-6">
              <e-icon name="add" size="xs" color="text-white dark:text-neutral-white" />
              <span
                class="text-body-3 text-white dark:from-white dark:via-white/90 dark:to-white/80"
              >
                {{ $t('users.newUser') }}
              </span>
            </div>
          </template>
        </e-btn>
      </div>
    </template>
    <template #main-content>
      <div class="flex flex-col h-fit gap-3">
        <e-table
          :columns="columns"
          :rows="profiles"
          :totalRecords="profiles.length"
          rowKey="id"
          @setSelectedRow="handleRowClick"
        >
          <template v-if="hasAnyProfileActionPermission" #cell-name-profile="{ rowOrig }">
            <td class="px-3 py-2">
              {{ rowOrig.profileData?.name ?? '—' }}
            </td>
          </template>
          <!-- Slot para acciones -->
          <template #cell-name-accion="{ rowOrig }">
            <td>
              <div class="flex w-full justify-center items-center gap-2">
                <!-- Botón editar -->
                <div
                  v-if="canUpdate('users')"
                  @click="goToEditProfile(rowOrig)"
                  class="flex items-center justify-center p-1.5 rounded-full bg-primary-3 hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors duration-200 cursor-pointer"
                  :title="$t('users.updateUser')"
                >
                  <e-icon name="edit" size="sm" color="text-primary hover:text-primary-2" />
                </div>
                <!-- Botón eliminar -->
                <div
                  v-if="canDelete('users')"
                  @click="handleDeleteProfile(rowOrig)"
                  class="flex items-center justify-center p-1.5 rounded-full bg-danger/20 hover:bg-danger/10 dark:hover:bg-danger/30 transition-colors duration-200 cursor-pointer"
                  :title="$t('users.deleteUser')"
                >
                  <e-icon name="delete" size="sm" color="text-danger hover:text-danger-2" />
                </div>
              </div>
            </td>
          </template>
        </e-table>
      </div>
    </template>
  </content-tpl>

  <!-- Diálogo de confirmación de eliminación -->
  <e-dialog
    :show="showDeleteDialog"
    bgColor="bg-white dark:bg-socrates-card-dark"
    :title="$t('users.form.confirmation.deleteTitle')"
    @close="closeDeleteDialog"
  >
    <template #content>
      <div class="w-[60vw] max-w-md max-h-[80vh] overflow-y-auto">
        <div class="flex flex-col items-center justify-center py-8 px-6">
          <!-- Icono de advertencia -->
          <div class="mb-6">
            <div
              class="w-20 h-20 bg-danger/20 rounded-full flex items-center justify-center animate-pulse"
            >
              <e-icon name="warning" size="3rem" color="text-danger" class="animate-bounce" />
            </div>
          </div>

          <!-- Título de confirmación -->
          <h3 class="text-title-2 font-bold text-danger dark:text-danger/90 mb-3 text-center">
            {{ $t('users.form.confirmation.deleteInfoTitle') }}
          </h3>

          <!-- Mensaje descriptivo -->
          <p class="text-body-3 text-gray-700 dark:text-gray-300 text-center mb-6 leading-relaxed">
            {{ $t('users.deleteInfoMessage') }}
            <span
              class="font-mono font-bold text-danger dark:text-danger-2 text-body-2 px-2 py-1 bg-danger/10 dark:bg-danger/20 rounded-lg border border-danger/20 dark:border-danger/30 shadow-sm"
            >
              {{ profileToDelete?.name }} {{ profileToDelete?.lastname }}
            </span>
            . {{ $t('users.form.confirmation.deleteInfoMessageEnd') }}
          </p>

          <!-- Información del perfil a eliminar -->
          <div
            class="w-full bg-danger/5 dark:bg-danger/10 rounded-lg p-4 mb-6 border border-danger/20 dark:border-danger/30"
          >
            <div class="flex items-center gap-2 mb-2">
              <e-icon name="person" size="sm" color="text-danger" />
              <span class="text-body-3 text-danger dark:text-danger/90">
                {{ $t('users.form.general.deleteUser') }}
              </span>
            </div>
            <ul class="text-caption-2 text-gray-600 dark:text-gray-400 space-y-1 ml-4">
              <li class="flex items-center gap-1">
                <e-icon name="person" size="xs" color="text-danger" />
                <span>{{ profileToDelete?.name }} {{ profileToDelete?.lastname }}</span>
              </li>
              <li class="flex items-center gap-1">
                <e-icon name="account_circle" size="xs" color="text-danger" />
                <span>{{ profileToDelete?.username }}</span>
              </li>
            </ul>
          </div>

          <!-- Botones de acción -->
          <div class="flex justify-end gap-3 w-full">
            <e-btn
              level="3"
              :text="$t('users.form.actions.cancel')"
              @click="closeDeleteDialog"
              class="min-w-[120px]"
            />
            <e-btn
              level="1"
              :text="$t('users.form.actions.deleteuser')"
              iconName="delete"
              color="bg-danger hover:bg-danger/80"
              @click="confirmDeleteProfile"
              class="min-w-[160px]"
            />
          </div>
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
                ? t('users.form.success.deleteTitle')
                : t('users.form.failed.deleteTitle')
            }}
          </h3>

          <!-- Mensaje -->
          <p class="text-body-3 text-gray-700 dark:text-gray-300 text-center mb-6 leading-relaxed">
            <template v-if="deleteSuccess">
              {{ t('users.successDelete') }}
              <span
                class="font-mono font-bold text-primary dark:text-primary-2 text-body-2 px-2 py-1 bg-primary/10 dark:bg-primary/20 rounded-lg border border-primary/20 dark:border-primary/30 shadow-sm"
              >
                {{ profileToDelete?.name }}
              </span>
            </template>
            <template v-else>
              {{ t('users.form.failed.deleteMessage') }}
              <span
                class="font-mono font-bold text-danger dark:text-danger-2 text-body-2 px-2 py-1 bg-danger/10 dark:bg-danger/20 rounded-lg border border-danger/20 dark:border-danger/30 shadow-sm"
              >
                {{ profileToDelete?.name }}
              </span>
              <span v-if="deleteErrorMsg" class="block mt-2 text-caption-2 text-gray-500">
                {{ t('users.delete.error.detail', { msg: deleteErrorMsg }) }}
              </span>
            </template>
          </p>

          <!-- Botón -->
          <div class="w-full">
            <e-btn
              level="1"
              :text="t('users.form.actions.continue')"
              iconName="sym-arrow_forward"
              @click="closeSuccessDialog"
              class="w-full h-12 text-body-2 font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            />
          </div>

          <p class="text-caption-2 text-gray-500 dark:text-gray-400 text-center mt-4">
            {{ t('users.redirectNote') }}
          </p>
        </div>
      </div>
    </template>
  </e-dialog>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRouter } from 'vue-router';
  import { loading } from '@alexochihua/exos-library-components';
  import ContentTpl from '@/layouts/ContentTpl.vue';
  import { useProfilesStore } from '@/stores/profiles';
  import { usePermissions } from '@/helpers/userPermissions';

  const { t } = useI18n();
  const router = useRouter();
  const profilesStore = useProfilesStore();
  const { canUpdate, canDelete, canCreate } = usePermissions();

  // Variables reactivas
  const showDeleteDialog = ref(false);
  const profileToDelete = ref(null);
  const showSuccessDialog = ref(false);
  const deleteSuccess = ref(false);

  const hasAnyProfileActionPermission = computed(() => {
    return canUpdate('users') || canDelete('users');
  });

  // Definir columnas de la tabla
  const columns = computed(() => {
    const baseColumns = [
      {
        title: t('users.form.general.name'),
        field: 'name',
        sortable: true,
        required: true
      },
      {
        title: t('users.form.general.lastname'),
        field: 'lastname',
        sortable: true,
        required: true
      },
      {
        title: t('users.form.general.username'),
        field: 'username',
        sortable: true,
        required: true
      },
      {
        title: t('users.form.general.profile'),
        field: 'profile',
        sortable: true,
        required: true
      }
    ];

    if (hasAnyProfileActionPermission.value) {
      baseColumns.push({
        title: t('users.form.general.actions'),
        field: 'accion',
        sortable: false,
        required: true
      });
    }

    return baseColumns;
  });

  // Obtener perfiles del store
  const profiles = computed(() => profilesStore.profiles);

  // Cargar los perfiles al montar el componente
  onMounted(async () => {
    loading.show({ project: 'services' });
    try {
      await profilesStore.fetchProfiles();
    } finally {
      setTimeout(() => {
        loading.hide();
      }, 800);
    }
  });

  // Acción para ir al formulario de creación
  const goToCreateProfile = () => {
    router.push({ name: 'profiles-form' });
  };

  // Acción para ir al formulario de edición
  const goToEditProfile = async (profile) => {
    await profilesStore.fetchProfileDetail(profile.id);
    router.push({ name: 'profiles-form' });
  };

  // Manejar clic en fila
  const handleRowClick = ({ row }) => {
    // Aquí podrías implementar lógica adicional si es necesario
    console.log('Row clicked:', row);
  };

  // Manejar eliminación de perfil
  const handleDeleteProfile = (profile) => {
    profileToDelete.value = profile;
    showDeleteDialog.value = true;
  };

  // Cerrar diálogo de eliminación
  const closeDeleteDialog = () => {
    showDeleteDialog.value = false;
  };

  // Confirmar eliminación
  const confirmDeleteProfile = async () => {
    try {
      loading.show({ project: 'services' });
      const resp = await profilesStore.deleteProfile(profileToDelete.value.id);
      loading.hide();
      showDeleteDialog.value = false;
      deleteSuccess.value = resp.success === true;
      profilesStore.fetchProfiles();
      showSuccessDialog.value = true;
    } catch (error) {
      loading.hide();
      console.error('Error al eliminar el perfil:', error);
      deleteSuccess.value = false;
      showDeleteDialog.value = false;
      showSuccessDialog.value = true;
    }
  };

  const closeSuccessDialog = () => {
    showSuccessDialog.value = false;
    profileToDelete.value = null;
  };
</script>
