import api from "../../services/api";
import type { Material } from "./materials.types";

export const getMaterials = async (params?: {
  search?: string;
  categoryId?: number;
  isActive?: boolean;
  pageNumber?: number;
  pageSize?: number;
}) => {
  const response = await api.get("/materials", {
    params,
  });

  const data = response.data.data;

  return {
    items: data.items as Material[],
    totalCount: data.totalCount,
    pageNumber: data.pageNumber,
    pageSize: data.pageSize,
  };
};

export const createMaterial = async (data: any) => {
  return await api.post("/materials", data);
};

export const updateMaterial = async (id: number, data: any) => {
  return await api.put(`/materials/${id}`, data);
};

export const deleteMaterial = async (id: number) => {
  return await api.delete(`/materials/${id}`);
};