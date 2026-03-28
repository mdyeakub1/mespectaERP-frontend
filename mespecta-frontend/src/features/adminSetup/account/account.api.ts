import api from "../../../services/api";

export const getMyAccount = async () => {
  const response = await api.get("/users/me");
  return response.data.data;
};

export const changePassword = async (data: {
  currentPassword: string;
  newPassword: string;
}) => {
  const response = await api.put(
    "/users/change-password",
    data
  );

  return response.data;
};