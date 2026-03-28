import api from "../../../../services/api";
import type { LeatherType } from "./leatherTypes.types";

export const getLeatherTypes = async (): Promise<LeatherType[]> => {
  const response = await api.get("/leather-types");
  return response.data.data;
};

export const createLeatherType = async (data: { name: string }) =>
  api.post("/leather-types", data);

export const updateLeatherType = async (id: number, data: { name: string }) =>
  api.put(`/leather-types/${id}`, data);

export const deleteLeatherType = async (id: number) =>
  api.delete(`/leather-types/${id}`);