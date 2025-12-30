import api from "./api";

export const viewAllSkills = async () => {
    try {
        const response = await api.get("/admin/skills");
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