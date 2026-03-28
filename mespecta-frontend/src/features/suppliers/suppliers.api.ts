import api from "../../services/api";
import type { Supplier } from "./suppliers.types";

export const getSuppliers = async (params?: {
  search?: string;
  isActive?: boolean;
  country?: string;
  pageNumber?: number;
  pageSize?: number;
}) => {
  const response = await api.get("/suppliers", {
    params,
  });

  const data = response.data.data;

  return {
    items: data.items as Supplier[],
    totalCount: data.totalCount,
    pageNumber: data.pageNumber,
    pageSize: data.pageSize,
  };
};

export const createSupplier = async (data: any) =>
  api.post("/suppliers", data);

export const updateSupplier = async (id: number, data: any) =>
  api.put(`/suppliers/${id}`, data);

export const deleteSupplier = async (id: number) =>
  api.delete(`/suppliers/${id}`);