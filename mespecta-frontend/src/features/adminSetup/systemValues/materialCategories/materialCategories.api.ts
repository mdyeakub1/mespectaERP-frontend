import api from "../../../../services/api";
import type { MaterialCategory } from "./materialCategories.types";

export const getMaterialCategories = async (): Promise<MaterialCategory[]> => {
  const response = await api.get("/material-categories");
  return response.data.data;
};

export const createMaterialCategory = async (data: { name: string }) => {
  return await api.post("/material-categories", data);
};

export const updateMaterialCategory = async (
  id: number,
  data: { name: string }
) => {
  return await api.put(`/material-categories/${id}`, data);
};

export const deleteMaterialCategory = async (id: number) => {
  return await api.delete(`/material-categories/${id}`);
};