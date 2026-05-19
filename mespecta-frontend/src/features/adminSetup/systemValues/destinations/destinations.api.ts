import api from "../../../../services/api";
import type { Destination } from "./destinations.types";

export const getDestinations = async (): Promise<Destination[]> => {
  const response = await api.get("/destinations");
  return response.data.data;
};

export const createDestination = async (data: { name: string }) =>
  api.post("/destinations", data);

export const updateDestination = async (id: number, data: { name: string }) =>
  api.put(`/destinations/${id}`, data);

export const deleteDestination = async (id: number) =>
  api.delete(`/destinations/${id}`);
