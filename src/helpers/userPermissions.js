import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';

export const usePermissions = () => {
  const authStore = useAuthStore();

  const hasPermission = (module, action) => {
    return authStore.hasPermission(module, action);
  };

  const getModulePermissions = (module) => {
    return authStore.getModulePermissions(module);
  };

  const canCreate = (module) => hasPermission(module, 'add');
  const canRead = (module) => hasPermission(module, 'list');
  const canUpdate = (module) => hasPermission(module, 'edit');
  const canDelete = (module) => hasPermission(module, 'delete');
  const canRestart = (module) => hasPermission(module, 'restart');

  const deployMonitoringPermissions = computed(() => 
    getModulePermissions('deploy-monitoring')
  );
  
  const usersPermissions = computed(() => 
    getModulePermissions('users')
  );
  
  const profilesPermissions = computed(() => 
    getModulePermissions('profiles')
  );

  return {
    hasPermission,
    getModulePermissions,
    canCreate,
    canRead,
    canUpdate,
    canDelete,
    canRestart,
    deployMonitoringPermissions,
    usersPermissions,
    profilesPermissions
  };
};