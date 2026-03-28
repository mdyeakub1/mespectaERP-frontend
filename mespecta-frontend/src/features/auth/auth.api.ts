import api from "../../services/api";
import axios from "axios";

const BASE_URL = "https://localhost:7261/api";

export const loginUser = async (data: { email: string; password: string }) => {
  const response = await api.post("/users/login", data);
  return response.data.data;
};

export const refreshTokenApi = async (refreshToken: string) => {
  // Use raw axios to avoid interceptor loop
  const response = await axios.post(`${BASE_URL}/users/refresh`, { refreshToken });
  return response.data.data as { token: string; refreshToken: string };
};

export const logoutApi = async (refreshToken: string) => {
  await api.post("/users/logout", { refreshToken });
};
