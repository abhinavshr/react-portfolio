import api from "./api";

export const viewAllProjectImages = async () => {
  try {
    const response = await api.get("/admin/project-images");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch project images" };
  }
};