import api from "../../services/api";
import type {
  ApiResponse,
  PagedResponse,
  CitesOutboundSoldItem,
  CitesOutboundSoldFilter,
} from "./citesOutboundSold.types";

export const getCitesOutboundSold = async (params?: CitesOutboundSoldFilter) => {
  const response = await api.get<ApiResponse<PagedResponse<CitesOutboundSoldItem>>>(
    "/finished-products/sold",
    { params }
  );
  return response.data;
};
