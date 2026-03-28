import api from "../../services/api";


export const getCraftsmen = async () => {
  const response = await api.get("/craftsmen");
  return response.data.data;
};

export const getCraftsmanById = async (
  id: number
) => {
  const response = await api.get(
    `/craftsmen/${id}`
  );
  return response.data.data;
};