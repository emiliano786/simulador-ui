<template>
  <aside>
    <!-- Layout horizontal para xs-sm-md, vertical para lg+ -->
    <div
      class="flex lg:hidden w-full items-center bg-secondary dark:bg-socrates-card-dark shadow-md shadow-slate-600 dark:shadow-black px-2 py-2 gap-2"
    >
      <!-- Info usuario a la izquierda -->
      <div class="flex items-center gap-2 min-w-max">
        <div
          class="h-10 w-10 rounded-full bg-gradient-to-br from-white/25 to-white/15 flex items-center justify-center font-bold text-white shadow-sm"
        >
          {{ userInitials }}
        </div>
        <div class="flex flex-col">
          <span class="text-interactive-1 text-white dark:text-white text-xs leading-tight">
            {{ currentUser ? `${currentUser.name}` : $t('sidebar.user') }}
          </span>
          <span class="text-caption-2 text-white/70 text-xs leading-tight">
            {{ currentUser?.profileName }}
          </span>
        </div>
      </div>

      <!-- Módulos con scroll-x en el centro -->
      <nav
        class="flex-1 flex overflow-x-auto gap-2 px-2 scrollbar-thin scrollbar-thumb-primary/40 scrollbar-track-transparent"
      >
        <div
          v-for="mod in accessibleModules"
          :key="mod.route"
          @click="navigateTo(mod.route)"
          :class="[
            'flex items-center gap-1 px-3 py-2 cursor-pointer transition-all duration-200 min-w-max',
            $route.name === mod.route
              ? 'text-white border-b-[3px] border-white dark:border-primary'
              : 'text-white/80 hover:text-white dark:text-gray-300',
            'whitespace-nowrap'
          ]"
        >
          <e-icon :name="mod.icon" size="sm" />
          <span v-if="$route.name === mod.route" class="text-xs font-medium">{{
            $t(mod.label)
          }}</span>
        </div>
      </nav>

      <!-- Cerrar sesión a la derecha -->
      <div
        class="flex items-center min-w-max px-2 py-2 text-body-3 text-white/80 hover:text-white dark:text-gray-300 cursor-pointer"
        @click="logout"
      >
        <e-icon size="sm" data-test="sidebar-logout" name="logout" />
      </div>
    </div>

    <!-- Sidebar vertical para lg+ -->
    <div
      class="hidden lg:flex h-full min-h-max min-w-[80px] max-w-[200px] lg:w-[11vw] xl:w-[11vw] xxl:w-[9vw] bg-secondary dark:bg-socrates-card-dark shadow-md shadow-slate-600 dark:shadow-black flex-col justify-between pt-7 pb-2 rounded-r-2xl"
    >
      <!-- Usuario -->
      <div class="flex items-center gap-3 p-2 sm:p-4 cursor-default">
        <div
          class="h-10 w-10 rounded-full bg-gradient-to-br from-white/25 to-white/15 flex items-center justify-center font-bold text-white shadow-sm"
        >
          {{ userInitials }}
        </div>
        <div class="flex flex-col">
          <span class="text-interactive-1 text-white dark:text-white">
            {{ currentUser ? `${currentUser.name}` : $t('sidebar.user') }}
          </span>
          <span class="text-caption-2 text-white/70">
            {{ currentUser?.profileName }}
          </span>
        </div>
      </div>
      <!-- Navegación -->
      <nav class="flex-1 flex flex-col gap-3">
        <div
          v-for="mod in accessibleModules"
          :key="mod.route"
          @click="navigateTo(mod.route)"
          :class="[
            'grid grid-cols-[auto_1fr] w-full items-center gap-1 text-left px-3 py-2 text-body-3 hover:cursor-pointer transition-all duration-200',
            $route.name === mod.route
              ? 'text-white border-r-[3px] border-white dark:border-primary'
              : 'text-white/80 hover:text-white dark:text-gray-300 hover:border-r-[3px] hover:border-white dark:hover:border-primary'
          ]"
        >
          <e-icon :name="mod.icon" size="sm" :data-test="mod.dataTest" />
          <span>{{ $t(mod.label) }}</span>
        </div>
      </nav>

      <!-- Botón de Cerrar Sesión -->
      <div
        class="grid grid-cols-[auto_1fr] w-full items-center gap-1 text-left px-3 py-2 text-body-3 text-white/80 hover:text-white dark:text-gray-300 hover:border-r-[3px] hover:border-white dark:hover:border-primary hover:cursor-pointer"
        @click="logout"
      >
        <e-icon size="sm" data-test="sidebar-logout" name="logout" />
        <span>{{ $t('sidebar.logout') }}</span>
      </div>
    </div>
  </aside>

  <!-- Diálogo de confirmación para cerrar sesión -->
  <e-dialog
    :show="showLogoutDialog"
    bgColor="bg-white dark:bg-socrates-card-dark"
    @close="cancelLogout"
  >
    <template #content>
      <div class="w-[60vw] max-w-md max-h-[80vh] overflow-y-auto">
        <div class="flex flex-col items-center justify-center py-8 px-6">
          <!-- Icono de logout -->
          <div class="mb-6">
            <div
              class="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center animate-pulse"
            >
              <e-icon name="logout" size="3rem" color="text-primary" class="animate-bounce" />
            </div>
          </div>

          <!-- Título -->
          <h3 class="text-title-2 font-bold text-primary dark:text-primary/90 mb-3 text-center">
            {{ $t('sidebar.logoutConfirmTitle') }}
          </h3>

          <!-- Mensaje -->
          <p class="text-body-3 text-gray-700 dark:text-gray-300 text-center mb-6 leading-relaxed">
            {{ $t('sidebar.logoutConfirmMessage') }}
          </p>

          <!-- Información del usuario -->
          <div
            class="w-full bg-primary/5 dark:bg-primary/10 rounded-lg p-4 mb-6 border border-primary/20 dark:border-primary/30"
          >
            <div class="flex items-center gap-3">
              <div
                class="h-12 w-12 rounded-full bg-gradient-to-br from-primary/25 to-primary/15 flex items-center justify-center font-bold text-primary shadow-sm"
              >
                {{ userInitials }}
              </div>
              <div>
                <p class="text-body-3 font-medium text-gray-800 dark:text-gray-200">
                  {{
                    currentUser
                      ? `${currentUser.name} ${currentUser.lastname || ''}`
                      : $t('sidebar.user')
                  }}
                </p>
                <p class="text-caption-2 text-gray-600 dark:text-gray-400">
                  {{ currentUser?.profileName || $t('sidebar.userRole') }}
                </p>
              </div>
            </div>
          </div>

          <!-- Botones de acción -->
          <div class="flex gap-3 w-full">
            <e-btn
              level="2"
              :text="$t('sidebar.logoutCancel')"
              @click="cancelLogout"
              class="flex-1 h-12 text-body-2 font-medium"
            />
            <e-btn
              level="1"
              :text="$t('sidebar.logoutConfirm')"
              iconName="logout"
              @click="confirmLogout"
              class="flex-1 h-12 text-body-2 font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-primary hover:bg-primary/90 text-white"
            />
          </div>

          <!-- Nota adicional -->
          <p class="text-caption-2 text-gray-500 dark:text-gray-400 text-center mt-4">
            {{ $t('sidebar.logoutNote') }}
          </p>
        </div>
      </div>
    </template>
  </e-dialog>
</template>

<script setup>
  import { useRouter, useRoute } from 'vue-router';
  import { useAuthStore } from '@/stores/auth';
  import { computed, ref } from 'vue';

  const router = useRouter();
  const $route = useRoute();
  const authStore = useAuthStore();

  const currentUser = computed(() => authStore.getCurrentUser());

  const userInitials = computed(() => {
    if (!currentUser.value) return 'U';
    const { name, lastname } = currentUser.value;
    return `${name?.charAt(0) || ''}${lastname?.charAt(0) || ''}`.toUpperCase();
  });

  const allModules = [
    {
      moduleKey: 'deploy-monitoring',
      route: 'deploys-query',
      icon: 'sym-troubleshoot',
      label: 'sidebar.deploysMonitoring',
      dataTest: 'sidebar-deploys-monitoring',
      requiredAction: 'list'
    },
    {
      moduleKey: 'users',
      route: 'profiles-query',
      icon: 'group',
      label: 'sidebar.users',
      dataTest: 'sidebar-users',
      requiredAction: 'list'
    },
    {
      moduleKey: 'profiles',
      route: 'user-profiles',
      icon: 'group',
      label: 'sidebar.profiles',
      dataTest: 'sidebar-profiles',
      requiredAction: 'list'
    }
  ];

  const accessibleModules = computed(() => {
    if (!currentUser.value || !currentUser.value.permissions) {
      return [];
    }

    return allModules.filter((mod) => {
      const userPermission = currentUser.value.permissions.find(
        (perm) => perm.module === mod.moduleKey
      );

      return userPermission && userPermission.actions.includes(mod.requiredAction);
    });
  });

  const navigateTo = (routeName) => {
    router.push({ name: routeName });
  };

  // Estado para el diálogo de confirmación de logout
  const showLogoutDialog = ref(false);

  const logout = () => {
    showLogoutDialog.value = true;
  };

  const confirmLogout = () => {
    showLogoutDialog.value = false;
    authStore.logout();
  };

  const cancelLogout = () => {
    showLogoutDialog.value = false;
  };
</script>

<style scoped>
  .scrollbar-thin {
    scrollbar-width: thin;
  }

  .scrollbar-thumb-primary\/40 {
    scrollbar-color: #e1262866 #0000;
  }
</style>
