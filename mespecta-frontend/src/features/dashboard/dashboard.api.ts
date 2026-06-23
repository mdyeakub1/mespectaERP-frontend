import api from "../../services/api";
import type { DashboardData, DashboardPeriod } from "./dashboard.types";

export interface DashboardParams {
  period?: DashboardPeriod;
  fromDate?: string;
  toDate?: string;
}

export const getDashboard = async (params: DashboardParams): Promise<DashboardData> => {
  const response = await api.get("/dashboard", { params });
  return response.data.data;
};
