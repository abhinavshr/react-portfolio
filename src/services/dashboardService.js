import api from "./api";

export const getTotalProjects = async () => {
  const response = await api.get("/admin/total-projects");
  return response.data;
};