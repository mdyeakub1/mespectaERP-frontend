import api from "../../services/api";

/* =============================
   FILTER TYPE
============================= */
export interface FinishedProductFilter {
  searchTerm?: string;
  isSold?: boolean;
  productId?: number;
  productionId?: number;
  citesInboundId?: number;
  createdFrom?: string;
  createdTo?: string;
  pageNumber?: number;
  pageSize?: number;
}

/* =============================
   GET ALL (PAGINATED)
============================= */
export const getFinishedProducts = async (
  params?: FinishedProductFilter
) => {
  const response = await api.get("/finished-products", {
    params,
  });

  const data = response.data.data;

  return {
    items: data.items,
    totalCount: data.totalCount,
    pageNumber: data.pageNumber,
    pageSize: data.pageSize,
  };
};

/* =============================
   GET BY ID
============================= */
export const getFinishedProductById = async (
  id: number
) => {
  const response = await api.get(
    `/finished-products/${id}`
  );

  return response.data.data;
};