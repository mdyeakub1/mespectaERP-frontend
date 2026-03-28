import api from "../../services/api";
import type { Customer } from "./customer.types";

export const getCustomers = async (params?: {
  search?: string;
  pageNumber?: number;
  pageSize?: number;
}) => {
  const response = await api.get("/customers", {
    params,
  });

  const data = response.data.data;

  return {
    items: data.items as Customer[],
    totalCount: data.totalCount,
    pageNumber: data.pageNumber,
    pageSize: data.pageSize,
  };
};

export const createCustomer = async (data: any) => {
  return await api.post("/customers", data);
};

export const updateCustomer = async (
  id: number,
  data: any
) => {
  return await api.put(`/customers/${id}`, data);
};

export const deleteCustomer = async (id: number) => {
  return await api.delete(`/customers/${id}`);
};