import api from "../../../../services/api";
import type { DocumentType } from "./documentTypes.types";

export const getDocumentTypes = async (): Promise<DocumentType[]> => {
  const response = await api.get("/document-types");
  return response.data.data;
};

export const createDocumentType = async (data: { name: string }) => {
  return await api.post("/document-types", data);
};

export const updateDocumentType = async (
  id: number,
  data: { name: string }
) => {
  return await api.put(`/document-types/${id}`, data);
};

export const deleteDocumentType = async (id: number) => {
  return await api.delete(`/document-types/${id}`);
};