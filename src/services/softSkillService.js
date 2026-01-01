import api from "./api";

export const viewAllSoftSkills = async () => {
  try {
    const response = await api.get("/admin/soft-skills");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch soft skills" };
  }
};
