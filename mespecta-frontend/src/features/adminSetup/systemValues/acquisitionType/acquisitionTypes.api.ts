import api from "../../../../services/api";
import type { AcquisitionType } from "./acquisitionTypes.types";

export const getAcquisitionTypes = async (): Promise<AcquisitionType[]> => {
  const response = await api.get("/acquisition-types");
  return response.data.data;
};

export const createAcquisitionType = async (data: { name: string }) => {
  return await api.post("/acquisition-types", data);
};

export const updateAcquisitionType = async (
  id: number,
  data: { name: string }
) => {
  return await api.put(`/acquisition-types/${id}`, data);
};

export const deleteAcquisitionType = async (id: number) => {
  return await api.delete(`/acquisition-types/${id}`);
};