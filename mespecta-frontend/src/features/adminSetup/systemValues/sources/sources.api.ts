import api from "../../../../services/api";
import type { Source } from "./sources.types";

export const getSources = async (): Promise<Source[]> => {
  const response = await api.get("/sources");
  return response.data.data;
};

export const createSource = async (data: { name: string }) => {
  return await api.post("/sources", data);
};

export const updateSource = async (
  id: number,
  data: { name: string }
) => {
  return await api.put(`/sources/${id}`, data);
};

export const deleteSource = async (id: number) => {
  return await api.delete(`/sources/${id}`);
};