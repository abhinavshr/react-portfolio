import api from "./api";

export const getAdminProfileAbout = async () => {
  try {
    const response = await api.get("/admin/admin-info");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch profile about" };
  }
};
