import api from "./api";

export const viewAllSoftSkills = async () => {
  try {
    const response = await api.get("/admin/soft-skills");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch soft skills" };
  }
};

export const addSoftSkill = async (skillData) => {
  try {
    const response = await api.post("/admin/soft-skills", skillData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to add soft skill" };
  }
};

export const getSoftSkillById = async (id) => {
  try {
    const response = await api.get(`/admin/soft-skills/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch soft skill" };
  }
};

export const updateSoftSkill = async (id, skillData) => {
  try {
    const response = await api.put(`/admin/soft-skills/${id}`, skillData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to update soft skill" };
  }
};

export const deleteSoftSkill = async (id) => {
  try {
    const response = await api.delete(`/admin/soft-skills/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to delete soft skill" };
  }
};