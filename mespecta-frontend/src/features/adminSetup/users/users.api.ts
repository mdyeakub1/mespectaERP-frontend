import api from "../../../services/api";

export interface UserFilter {
  search?: string;
  role?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDescending?: boolean;
}

export interface PagedUsersResponse {
  items: any[];
  totalCount: number;
}

export const getUsers = async (filter: UserFilter = {}): Promise<PagedUsersResponse> => {
  const params: Record<string, any> = {
    Page: filter.page ?? 1,
    PageSize: filter.pageSize ?? 10,
  };
  if (filter.search)                         params.Search          = filter.search;
  if (filter.role)                           params.Role            = filter.role;
  if (filter.sortBy)                         params.SortBy          = filter.sortBy;
  if (filter.sortDescending !== undefined)   params.SortDescending  = filter.sortDescending;

  const response = await api.get("/users", { params });
  return response.data.data;
};

export const createUser = async (data: any) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const updateUser = async (id: number, data: any) => {
  const response = await api.put(`/users/${id}`, data);
  return response.data;
};

export const deleteUser = async (id: number) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

export const resetUserPassword = async (id: number) => {
  const response = await api.post(`/users/${id}/reset-password`);
  return response.data;
};
