import api from "../../../../services/api";
import type { OutgoingDocumentType } from "./outgoingDocumentTypes.types";

export const getOutgoingDocumentTypes = async (): Promise<OutgoingDocumentType[]> => {
  const response = await api.get("/outgoing-document-types");
  return response.data.data;
};

export const createOutgoingDocumentType = async (data: { name: string }) =>
  api.post("/outgoing-document-types", data);

export const updateOutgoingDocumentType = async (id: number, data: { name: string }) =>
  api.put(`/outgoing-document-types/${id}`, data);

export const deleteOutgoingDocumentType = async (id: number) =>
  api.delete(`/outgoing-document-types/${id}`);
