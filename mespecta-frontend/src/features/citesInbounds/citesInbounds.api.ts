import api from "../../services/api";
import type {
  ApiResponse,
  PagedResponse,
  CitesInboundResponse,
  CitesInboundFilter,
} from "./citesInbounds.types";

// GET ALL
export const getCitesInbounds = async (
  params?: CitesInboundFilter
) => {
  const response =
    await api.get<
      ApiResponse<PagedResponse<CitesInboundResponse>>
    >("/cites-inbounds", { params });

  return response.data;
};

// CREATE
export const createCitesInbound = async (data: any) => {
  const response = await api.post("/cites-inbounds", data);
  return response.data;
};