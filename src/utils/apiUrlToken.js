import { authService } from "../services/authService";

export const API_URL = "http://localhost:9090/api";

export const authConfig = () => ({
  headers: {
    Authorization: `Bearer ${authService.getToken()}`,
  },
});
