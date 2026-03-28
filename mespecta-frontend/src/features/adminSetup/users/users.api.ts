import api from "../../../services/api";

export interface UserFilter {
  search?: string;
  role?: string;
  page?: number;
  pageSize?: number;
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
  if (filter.search) params.Search = filter.search;
  if (filter.role) params.Role = filter.role;

  const response = await api.get("/users", { params });
  return response.data.data;
};

export const createUser = async (data: any) => {
  const response = await api.post("/users", data);
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
