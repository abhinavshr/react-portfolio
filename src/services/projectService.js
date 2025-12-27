import api from "./api";

export const viewAllProjects = async () => {
  try {
    const response = await api.get("/admin/projects");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch projects" };
  }
};
