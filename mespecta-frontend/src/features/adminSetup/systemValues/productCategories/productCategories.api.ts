import api from "../../../../services/api";
import type { ProductCategory } from "./productCategories.types";

export const getProductCategories = async (): Promise<ProductCategory[]> => {
  const response = await api.get("/product-categories");
  return response.data.data;
};

export const createProductCategory = async (data: {
  name: string;
  isActive: boolean;
}) => {
  return await api.post("/product-categories", data);
};

export const updateProductCategory = async (
  id: number,
  data: { name: string; isActive: boolean }
) => {
  return await api.put(`/product-categories/${id}`, data);
};

export const deleteProductCategory = async (id: number) => {
  return await api.delete(`/product-categories/${id}`);
};