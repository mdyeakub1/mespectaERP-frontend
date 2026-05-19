import api from "../../services/api";
import type {
  ApiResponse,
  PagedResponse,
  CitesOutboundStockItem,
  CitesOutboundStockFilter,
} from "./citesOutboundStock.types";

export const getCitesOutboundStock = async (params?: CitesOutboundStockFilter) => {
  const response = await api.get<ApiResponse<PagedResponse<CitesOutboundStockItem>>>(
    "/finished-products/stock",
    { params }
  );
  return response.data;
};
