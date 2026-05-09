import api from "../../services/api";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export const loginUser = async (data: { email: string; password: string }) => {
  const response = await api.post("/users/login", data);
  // Handle both camelCase and PascalCase response shapes
  const payload = response.data?.data ?? response.data?.Data;
  return {
    token: payload?.token ?? payload?.Token,
    refreshToken: payload?.refreshToken ?? payload?.RefreshToken,
    role: payload?.role ?? payload?.Role,
    email: payload?.email ?? payload?.Email,
    fullName: payload?.fullName ?? payload?.FullName,
    userId: payload?.userId ?? payload?.UserId,
  };
};

export const refreshTokenApi = async (refreshToken: string) => {
  // Use raw axios to avoid interceptor loop
  const response = await axios.post(`${BASE_URL}/users/refresh`, { refreshToken });
  // Handle both camelCase (controllers) and PascalCase (error middleware) responses
  const payload = response.data?.data ?? response.data?.Data;
  if (!payload) throw new Error("Empty refresh response");
  return {
    token: payload.token ?? payload.Token,
    refreshToken: payload.refreshToken ?? payload.RefreshToken,
  } as { token: string; refreshToken: string };
};

export const logoutApi = async (refreshToken: string) => {
  await api.post("/users/logout", { refreshToken });
};
