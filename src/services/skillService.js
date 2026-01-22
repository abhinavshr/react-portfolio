import api from "./api";

export const viewAllSkills = async (page = 1) => {
  try {
    const response = await api.get(`/admin/skills?page=${page}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch skills" };
  }
};

export const addSkill = async (skillData) => {
  try {
    const response = await api.post("/admin/skills", skillData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to add skill" };
  }
};

export const viewSkillById = async (id) => {
  try {
    const response = await api.get(`/admin/skills/${id}`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch skill" };
  }
};

export const updateSkill = async (id, skillData) => {
  try {
    const response = await api.put(`/admin/skills/${id}`, skillData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to update skill" };
  }
};

export const deleteSkill = async (id) => {
  try {
    const response = await api.delete(`/admin/skills/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to delete skill" };
  }
};
