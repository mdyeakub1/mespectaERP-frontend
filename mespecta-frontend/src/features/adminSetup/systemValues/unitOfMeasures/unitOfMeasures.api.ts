import api from "../../../../services/api";
import type { UnitOfMeasure } from "./unitOfMeasures.types";

export const getUnitOfMeasures = async (): Promise<UnitOfMeasure[]> => {
  const response = await api.get("/unit-of-measures");
  return response.data.data;
};

export const createUnitOfMeasure = async (data: {
  name: string;
  code: string;
}) => {
  return await api.post("/unit-of-measures", data);
};

export const updateUnitOfMeasure = async (
  id: number,
  data: { name: string; code: string }
) => {
  return await api.put(`/unit-of-measures/${id}`, data);
};

export const deleteUnitOfMeasure = async (id: number) => {
  return await api.delete(`/unit-of-measures/${id}`);
};