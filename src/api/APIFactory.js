import { api } from "../axios/api-conf";
import { isFormData, transformToParamsString } from "./utils";

export default {
  async get(payload) {
    const { path, query, headers = {}, setToken } = payload;
    const config = { headers: { ...headers } };

    if (setToken) {
      config.headers["Authorization"] =
        `Bearer ${localStorage.getItem("token")}`;
    }

    const q = transformToParamsString(query);

    return api.get(`${path}${q}`, config);
  },

  async post(payload) {
    const { body, path, query, headers = {}, setToken } = payload;
    const config = { headers: { ...headers } };

    if (setToken) {
      config.headers["Authorization"] =
        `Bearer ${localStorage.getItem("token")}`;
    }

    const isForm = isFormData(body);
    if (isForm) {
      delete config.headers["Content-Type"];
      delete config.headers["content-type"];
    }

    const q = transformToParamsString(query);

    return api.post(`${path}${q}`, body || {}, config);
  },

  async getFile(payload) {
    const { path, query } = payload;
    const q = transformToParamsString(query);
    const config = { responseType: "arraybuffer" };

    try {
      return await api.get(`${path}${q}`, config);
    } catch (error) {
      if (error.response && error.response.data) {
        const dataStr = new TextDecoder().decode(error.response.data);
        error.response.data = JSON.parse(dataStr);
      }
      throw error;
    }
  },

  async getFilePost(payload) {
    const { path, query, body } = payload;
    const q = transformToParamsString(query);
    const config = { responseType: "arraybuffer" };

    try {
      return await api.post(`${path}${q}`, body, config);
    } catch (error) {
      if (error.response && error.response.data) {
        const dataStr = new TextDecoder().decode(error.response.data);
        error.response.data = JSON.parse(dataStr);
      }
      throw error;
    }
  },
};
