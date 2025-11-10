import axios from 'axios';

let baseURL =  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/";

let initConfigAxios = {
  baseURL,
  timeout: 90000,
  headers: {
    'Content-Type': 'application/json'
  }
};

let initConfigAxiosFiles = {
  baseURL,
  timeout: 90000,
};

let interceptorResSuccess = function (response) {
  // Cualquier código de estado que se encuentre dentro del rango de 2xx hace que se active esta función
  // Hacer algo con los datos de respuesta

  return response;
};

let interceptorResError = function (error) {
  // Cualquier código de estado que quede fuera del rango de 2xx hace que se active esta función
  // Hacer algo con error de respuesta

  return Promise.reject(error);
};

const generalAPI = axios.create(initConfigAxios);
const generalAPIFiles = axios.create(initConfigAxiosFiles);

generalAPI.interceptors.response.use(interceptorResSuccess, interceptorResError);

const initAPI = function (configAPI = null) {
  if (configAPI) {
    let api = axios.create({ ...initConfigAxios, ...configAPI });
    api.interceptors.response.use(interceptorResSuccess, interceptorResError);
    return api;
  } else {
    return generalAPI;
  }
};

const initAPIFiles = function (configAPI = null) {
  if (configAPI) {
    let api = axios.create({ ...initConfigAxiosFiles, ...configAPI });
    api.interceptors.response.use(interceptorResSuccess, interceptorResError);
    return api;
  } else {
    return generalAPIFiles;
  }
};

export {
  initAPI,
  generalAPI as api,
  baseURL,
  initConfigAxios,
  interceptorResSuccess,
  interceptorResError,
  generalAPIFiles as apiFiles
};
