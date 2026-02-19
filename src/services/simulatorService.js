import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

export const simulatorService = {
  async sendIsoMessage(mti, fields) {
    const response = await axios.post(`${API_BASE_URL}/send-message`, {
      mti,
      fields,
    });
    return response.data;
  },
};
