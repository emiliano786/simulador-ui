import { api, initAPI } from '../axios/api-conf';
import { transformToParamsString, isFormData } from './utils';

const initAPIFactory = function (configAPI) {
  let apiAux = initAPI(configAPI)
  return {
    async get(payload) {
      var config = {
        headers: { ...payload.headers }
      };
      let { query } = payload;
      query = transformToParamsString(query);
      return new Promise((resolve, reject) => {
        apiAux
          .get(`${payload.path}${query}`, config)
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    async post(payload) {
      var config = {
        headers: { ...payload.headers }
      };
      let { query } = payload;
      query = transformToParamsString(query);
      return new Promise((resolve, reject) => {
        apiAux
          .post(`${payload.path}${query}`, payload.body, config)
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    async getFile(payload) {
      var config = { responseType: 'arraybuffer' };
      let { query } = payload;
      query = transformToParamsString(query);
      return new Promise((resolve, reject) => {
        apiAux
          .get(`${payload.path}${query}`, config)
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            let data = new TextDecoder().decode(error.response.data);
            data = JSON.parse(data);
            error.response.data = data;
            reject(error);
          });
      });
    },
    async getFilePost(payload) {
      var config = { responseType: 'arraybuffer' };
      let { query } = payload;
      query = transformToParamsString(query);
      return new Promise((resolve, reject) => {
        apiAux
          .post(`${payload.path}${query}`, payload.body, config)
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            let data = new TextDecoder().decode(error.response.data);
            data = JSON.parse(data);
            error.response.data = data;
            reject(error);
          });
      });
    }
  }
}
export { initAPIFactory }
export default {
  async get(payload) {
    var config = {
      headers: { ...payload.headers }
    };
    if (payload.setToken) {
      config.headers['Authorization'] = `Bearer ${localStorage.getItem(
        'token'
      )}`;
    }
    let { query } = payload;
    query = transformToParamsString(query);
    return new Promise((resolve, reject) => {
      api
        .get(`${payload.path}${query}`, config)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  async post(payload) {
    const { body, path, query, setToken } = payload;

    const config = { headers: {} };

    
    if (payload.headers && typeof payload.headers === 'object') {
      config.headers = { ...payload.headers };
    }


    if (setToken) {
      config.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    }

    const isForm = isFormData(body);


    if (isForm) {

      delete config.headers['Content-Type'];
      delete config.headers['content-type'];
    } else {
      if (!config.headers['Content-Type'] && !config.headers['content-type']) {
        config.headers['Content-Type'] = 'application/json';
      }
    }
    config.transformRequest = [(data, headers) => (isForm ? data : JSON.stringify(data))];

    const q = transformToParamsString(query);

    try {
      const res = await api.post(`${path}${q}`, isForm ? body : body ?? {}, config);
      return res;
    } catch (err) {
      throw err;
    }
  },
  async getFile(payload) {
    var config = { responseType: 'arraybuffer' };
    let { query } = payload;
    query = transformToParamsString(query);
    return new Promise((resolve, reject) => {
      api
        .get(`${payload.path}${query}`, config)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          let data = new TextDecoder().decode(error.response.data);
          data = JSON.parse(data);
          error.response.data = data;
          reject(error);
        });
    });
  },
  async getFilePost(payload) {
    var config = { responseType: 'arraybuffer' };
    let { query } = payload;
    query = transformToParamsString(query);
    return new Promise((resolve, reject) => {
      api
        .post(`${payload.path}${query}`, payload.body, config)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          let data = new TextDecoder().decode(error.response.data);
          data = JSON.parse(data);
          error.response.data = data;
          reject(error);
        });
    });
  }
};
