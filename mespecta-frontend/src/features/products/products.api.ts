import api from "../../services/api";

export const getProducts = async (params?: {
  search?: string;
  categoryId?: number;
  genderId?: number;
  pageNumber?: number;
  pageSize?: number;
}) => {
  const response = await api.get("/products", { params });

  const data = response.data.data;

  return {
    items: data.items,
    totalCount: data.totalCount,
    pageNumber: data.pageNumber,
    pageSize: data.pageSize,
  };
};


export const getProductById = async (id: number) => {
  const response = await api.get(`/products/${id}`);

  return response.data.data;
};

export const createProduct = async (data: any) =>
  api.post("/products", data);

export const updateProduct = async (id: number, data: any) =>
  api.put(`/products/${id}`, data);

export const deleteProduct = async (id: number) =>
  api.delete(`/products/${id}`);