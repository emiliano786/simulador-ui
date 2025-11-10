import { defineStore } from 'pinia';
import { ref } from 'vue';
import { DateTime } from 'luxon';
import APIFactory from "../api/APIFactory";
export const useDeployStore = defineStore('deploy', () => {
  // Función helper para crear objetos File simulados
  const createMockFile = (name: string, type: string) => {
    return new File(['mock content'], name, { type });
  };

  // Array de deploys con datos por defecto
  const deploys = ref();

  const deployOptions = ref([
    { label: 'Ambiente Local', value: 'local', ip: '0.0.0.0' },
    { label: 'Ambiente Dev - 198.32.32.9', value: 'development', ip: '132.0.0.0' },
    { label: 'Ambiente QA - 198.32.32.10', value: 'uat', ip: '122.0.0.0' },
    { label: 'Ambiente UAT - 198.32.32.11', value: 'QA', ip: '111.0.0.0' },

  ]);

  // Deploy seleccionado por ID
  const selectedDeploy = ref(null);

  /**
   * Simula la obtención de todos los deploys desde una API.
   * Ahora solo retorna la información actual sin sobrescribir.
   */
  const fetchDeploys = async () => {
    // Aquí iría la llamada real a la API
    // Por ahora, solo retornamos la información actual
    try {
      let response = await APIFactory.get({
        path: "/listProcesses/",
      });

      console.log("response.data.data", response.data.data);
      deploys.value = JSON.parse(JSON.stringify(response.data.data));
      return response.data.data;

    } catch (error) {
      console.error(error);

    }

    console.log('fetchDeploys: ', deploys.value);

    return deploys.value;
  };

  /**
   * Simula la obtención de un deploy por ID desde una API.
   * Por ahora, busca el deploy en el array local y lo asigna a selectedDeploy.
   * @param id ID del deploy a buscar
   */
  const fetchDeployDetail = async (id) => {
    // Aquí iría la llamada real a la API
    const found = deploys.value.find((d) => d.id == id) || null;
    selectedDeploy.value = found;
  };

  /**
   * Simula la obtención de un deploy por ID desde una API.
   * Por ahora, busca el deploy en el array local y lo asigna a selectedDeploy.
   * @param id ID del deploy a buscar
   */
  const getDeploymentsCatalogs = async () => {
    try {
      let response = await APIFactory.get({
        path: "/getSites/",
        setToken: true,
      });

      deployOptions.value = JSON.parse(JSON.stringify(response.data.data));
      return response.data.data;
    } catch (error) {
      console.error(error);

    }

    console.log('fetchDeploys: ', deploys.value);

    return deploys.value;
  };

  /**
   * Actualiza un deploy existente con nuevos datos.
   * @param id ID del deploy a actualizar
   * @param updatedData Datos actualizados del deploy
   */
  const updateDeploy = async (id, updatedData) => {

    const updatedDeployData = {
      id,
      ...updatedData,
      // Manejar certificados con la nueva estructura
      key: updatedData.tlsEnabled ? updatedData.key : null,
      cert: updatedData.tlsEnabled
        ? {
          file: updatedData.certFile,
          certExpiry: updatedData.certMetadata?.certExpiry
        }
        : null
    };

    delete updatedDeployData.certMetadata;
    delete updatedDeployData.certFile;
    console.log("updatedDeployData", updatedDeployData);

    selectedDeploy.value = await APIFactory.post({
      path: "/updateDeployment/",
      setToken: true,
      body: updatedDeployData,
    });

  };

  /**
 * Actualiza un deploy existente con nuevos datos.
 * @param id ID del deploy a actualizar
 * @param updatedData Datos actualizados del deploy
 */
  const restartDeploy = async (id) => {

    const deployToRestart = {
      id
    };

    selectedDeploy.value = await APIFactory.post({
      path: "/restartDeployment/",
      setToken: true,
      body: deployToRestart,
    });

  };

  const restartAllDeploys = async () => {
    selectedDeploy.value = await APIFactory.post({
      path: "/restartAllDeployments/",
      setToken: true,
    });

  };

  /**
   * Genera un ID único para nuevos deploys
   * @returns string ID único
   */
  const generateDeployId = () => {
    const maxId = Math.max(...deploys.value.map((d) => parseInt(d.id)), 0);
    return (maxId + 1).toString();
  };

  /**
   * Genera el estado de los contenedores basado en la cantidad de contenedores
   * @param containers Cantidad de contenedores
   * @returns Array con los estados de los contenedores
   */
  const generateContainerStatuses = (containers: number) => {
    const statuses = [];

    for (let i = 0; i < containers; i++) {
      if (i === 0) {
        statuses.push('healthy');
      } else if (i === 1) {
        statuses.push('warning');
      } else if (i === 2) {
        statuses.push('error');
      } else {
        statuses.push('healthy');
      }
    }

    return statuses;
  };

  /**
   * Genera metadatos de certificado simulados usando Luxon
   * @returns Objeto con metadatos del certificado
   */
  const generateCertMetadata = () => {
    const now = DateTime.now();
    const expiryDate = now.plus({ days: Math.floor(Math.random() * 365) + 30 }); // Entre 30 y 395 días
    return {
      certExpiry: expiryDate.toISODate()
    };
  };

  /**
   * Crea un nuevo deploy con los datos proporcionados
   * @param deployData Datos del nuevo deploy
   * @returns Promise con el deploy creado
   */
  const createDeploy = async (deployData, tlsEnabled) => {
    let newDeploy = null;
    console.log("DEPLOY DATA [!]", deployData);

    newDeploy = await APIFactory.post({
      path: "/process",
      setToken: false,
      body: deployData,
    });

    return newDeploy;
  };

  const deleteDeploy = async (id) => {
    const deployToDelete = {
      id
    };

    let response = await APIFactory.post({
      path: "/deleteDeployment/",
      setToken: true,
      body: deployToDelete,
    });
    return response.data.code;
  };

  const deleteDeployTlsFiles = async (name) => {
    try {
      const deployToDelete = {
        name
      };

      let response = await APIFactory.post({
        path: "/deleteTlsFiles/",
        setToken: true,
        body: deployToDelete,
      });

      return response.data;
    } catch (error) {
      console.error("Error al eliminar archivos tls");
      console.log(error);
    }

  };

  const uploadTLS = async (formData) => {
    try {
      let response = await APIFactory.post({
        path: "/uploadTlsFiles/",
        setToken: true,
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response;
    } catch (error) {
      console.log("[X] Error saving TLS files");
      console.log(error);
    }
  };

  /**
   * Limpia el deploy seleccionado (útil para crear nuevos deploys)
   */
  const clearSelectedDeploy = () => {
    selectedDeploy.value = null;
  };

  return {
    deploys,
    selectedDeploy,
    fetchDeploys,
    fetchDeployDetail,
    updateDeploy,
    createDeploy,
    clearSelectedDeploy,
    generateCertMetadata,
    deployOptions,
    getDeploymentsCatalogs,
    restartDeploy,
    uploadTLS,
    deleteDeploy,
    deleteDeployTlsFiles,
    restartAllDeploys
  };
});
