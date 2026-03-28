import api from "../../../../services/api";
import type { Color } from "./colors.types";

export const getColors = async (): Promise<Color[]> => {
  const response = await api.get("/colors");
  return response.data.data;
};

export const createColor = async (data: { name: string }) =>
  api.post("/colors", data);

export const updateColor = async (id: number, data: { name: string }) =>
  api.put(`/colors/${id}`, data);

export const deleteColor = async (id: number) =>
  api.delete(`/colors/${id}`);