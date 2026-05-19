import api from "../../../../services/api";
import type { OutboundReason } from "./outboundReasons.types";

export const getOutboundReasons = async (): Promise<OutboundReason[]> => {
  const response = await api.get("/outbound-reasons");
  return response.data.data;
};

export const createOutboundReason = async (data: { name: string }) =>
  api.post("/outbound-reasons", data);

export const updateOutboundReason = async (id: number, data: { name: string }) =>
  api.put(`/outbound-reasons/${id}`, data);

export const deleteOutboundReason = async (id: number) =>
  api.delete(`/outbound-reasons/${id}`);
