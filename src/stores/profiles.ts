import APIFactory from '@/api/APIFactory';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { api } from './axios';
export const useProfilesStore = defineStore('profiles', () => {
  // Array de perfiles con datos por defecto
  const profiles = ref([]);

  // Perfil seleccionado por ID
  const selectedProfile = ref(null);

  /**
   * Simula la obtención de todos los perfiles desde una API.
   * @returns Promise con los perfiles
   */
  const fetchProfiles = async () => {
    let response = await APIFactory.get({
      path: "/users/",
      setToken: true,
    });

    console.log("response", response.data.response.data);
    
    profiles.value = response.data.response.data
    return profiles.value;
  };

  /**
   * Simula la obtención de un perfil por ID desde una API.
   * @param id ID del perfil a buscar
   */
  const fetchProfileDetail = async (id) => {
    // Aquí iría la llamada real a la API
    const found = profiles.value.find((p) => p.id === id) || null;
    selectedProfile.value = found;
  };

  /**
   * Genera un ID único para nuevos perfiles
   * @returns string ID único
   */
  const generateProfileId = () => {
    const maxId = Math.max(...profiles.value.map((p) => parseInt(p.id)), 0);
    return (maxId + 1).toString();
  };

  /**
   * Crea un nuevo perfil con los datos proporcionados
   * @param profileData Datos del nuevo perfil
   * @returns Promise con el perfil creado
   */
  const createProfile = async (profileData) => {

    const newProfile = {
      name: profileData.name,
      lastname: profileData.lastname,
      username: profileData.username,
      password: profileData.password,
      profile: profileData.profile,
      email: profileData.email
    };

    let response = await APIFactory.post({
      path: "/user/",
      setToken: true,
      body: newProfile,
    });

    console.log("RESPONSE", response);

    return newProfile;
  };

  /**
   * Actualiza un perfil existente con nuevos datos.
   * @param id ID del perfil a actualizar
   * @param updatedData Datos actualizados del perfil
   */
  const updateProfile = async (id, updatedData) => {
    
    const newProfile = {
      name: updatedData.name,
      lastname: updatedData.lastname,
      username: updatedData.username,
      profile: updatedData.profile,
      id
    };

    let response = await APIFactory.post({
      path: "/updateUser/",
      setToken: true,
      body: newProfile,
    });

    console.log("RESPONSE", response);

    return newProfile;
  };

  /**
   * Elimina un perfil por ID
   * @param id ID del perfil a eliminar
   */
  const deleteProfile = async (id) => {
    try {
      if (!id) throw new Error('id is required');

      const body = { id };

      const res = await APIFactory.post({
        path: '/deleteUser/',
        setToken: true,
        body
      });

      const resultData = res.data.response;
      return resultData;
    } catch (error) {
      console.error('Error deleting profile:', error);
    }
  };

  /**
   * Limpia el perfil seleccionado (útil para crear nuevos perfiles)
   */
  const clearSelectedProfile = () => {
    selectedProfile.value = null;
  };

  /**
   * Valida las credenciales de login
   * @param email Nombre de usuario
   * @param password Contraseña
   * @returns Promise con el resultado de la validación
   */
  const validateCredentials = async (email, password) => {
    let data = await APIFactory.post({
      path: "/login",
      body: { email, password },
    });
    console.log("data", data);

    localStorage.setItem('token', data.data.response.data.token);
    if (data.data.response.data.user) {
      return { success: true, user: data.data.response.data.user };
    } else {
      return { success: false, message: 'Usuario y/o contraseña incorrectos.' };
    }
  };

  return {
    profiles,
    selectedProfile,
    fetchProfiles,
    fetchProfileDetail,
    createProfile,
    updateProfile,
    deleteProfile,
    clearSelectedProfile,
    validateCredentials
  };
});
