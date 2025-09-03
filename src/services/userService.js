import axios from "axios";
import { API_URL, authConfig } from "../utils/apiUrlToken";

export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/person`, authConfig());
    return response.data;
  } catch (error) {
    console.error("Could not fetch users:", error);
    throw error;
  }
};
