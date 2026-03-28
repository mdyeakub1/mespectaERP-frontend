import api from "../../services/api";
import type { Production } from "./productions.types";

export interface ProductionFilter {
  searchTerm?: string;
  status?: number;
  productId?: number;
  userId?: number;
  createdFrom?: string;
  createdTo?: string;
  pageNumber?: number;
  pageSize?: number;
}

export interface ProductionPagedResponse {
  items: Production[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export const getProductions = async (
  params?: ProductionFilter
): Promise<ProductionPagedResponse> => {
  const response = await api.get("/productions", {
    params,
  });

  //  YOUR FORMAT
  return response.data.data;
};

export const startProduction = async (data: any) => {
  const response = await api.post(
    "/productions/start",
    data
  );

  return response.data;
};