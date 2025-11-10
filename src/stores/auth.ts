import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref(null);
  const isAuthenticated = ref(false);
  const userPermissions = ref([]);
  const isLoading = ref(true);

  // Restaurar estado de autenticación desde localStorage
  const restoreAuthState = () => {
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('userData');

      if (token && userData) {
        const user = JSON.parse(userData);
        setCurrentUser(user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error al restaurar estado de autenticación:', error);
      clearAuthState();
      return false;
    }
  };

  // Verificar si el token es válido
  const verifyToken = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return false;
      }

      // Aquí podrías hacer una llamada al API para verificar el token
      // Por ahora, verificamos que exista y tenga un formato válido
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        return false;
      }

      // Verificar expiración del token (si está implementado)
      try {
        const payload = JSON.parse(atob(tokenParts[1]));
        if (payload.exp && payload.exp < Date.now() / 1000) {
          return false;
        }
      } catch (e) {
        // Si no se puede decodificar, asumimos que es válido
        // En producción, deberías verificar con el backend
      }

      return true;
    } catch (error) {
      console.error('Error al verificar token:', error);
      return false;
    }
  };

  // Inicializar estado de autenticación
  const initializeAuth = async () => {
    isLoading.value = true;
    try {
      const isValid = await verifyToken();
      if (isValid) {
        restoreAuthState();
      } else {
        clearAuthState();
      }
    } catch (error) {
      console.error('Error al inicializar autenticación:', error);
      clearAuthState();
    } finally {
      isLoading.value = false;
    }
  };

  const setCurrentUser = (user) => {
    currentUser.value = user;
    isAuthenticated.value = true;

    if (user && user.permissions) {
      userPermissions.value = user.permissions;
    } else {
      userPermissions.value = [];
    }

    // Persistir en localStorage
    if (user) {
      localStorage.setItem('userData', JSON.stringify(user));
    }
  };

  const clearCurrentUser = () => {
    currentUser.value = null;
    isAuthenticated.value = false;
    userPermissions.value = [];
  };

  const clearAuthState = () => {
    clearCurrentUser();
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
  };

  const logout = () => {
    clearAuthState();
    // Redirigir al login
    window.location.href = '/login';
  };

  const getCurrentUser = () => {
    return currentUser.value;
  };

  const hasAuthenticatedUser = () => {
    return isAuthenticated.value && currentUser.value !== null;
  };

  const hasPermission = (module, action) => {
    if (!userPermissions.value.length) return false;

    const modulePermission = userPermissions.value.find((perm) => perm.module === module);

    return modulePermission && modulePermission.actions.includes(action);
  };

  const getModulePermissions = (module) => {
    if (!userPermissions.value.length) return [];

    const modulePermission = userPermissions.value.find((perm) => perm.module === module);

    return modulePermission ? modulePermission.actions : [];
  };

  const getAccessibleModules = () => {
    if (!userPermissions.value.length) return [];

    return userPermissions.value.map((perm) => perm.module);
  };

  const hasAnyListPermission = () => {
    return userPermissions.value.some((perm) => perm.actions.includes('list'));
  };

  return {
    currentUser,
    isAuthenticated,
    userPermissions,
    isLoading,
    setCurrentUser,
    clearCurrentUser,
    clearAuthState,
    restoreAuthState,
    verifyToken,
    initializeAuth,
    logout,
    getCurrentUser,
    hasAuthenticatedUser,
    hasPermission,
    getModulePermissions,
    getAccessibleModules,
    hasAnyListPermission
  };
});
