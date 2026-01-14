import api from "./api";

export const getTotalProjects = async () => {
  const response = await api.get("/admin/total-projects");
  return response.data;
};

export const getTotalSkills = async () => {
  const response = await api.get("/admin/total-skills");
  return response.data;
};

export const getTotalExperience = async () => {
  const response = await api.get("/admin/total-experiences");
  return response.data;
};