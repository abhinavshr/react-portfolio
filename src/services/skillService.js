import api from "./api";

export const viewAllSkills = async () => {
    try {
        const response = await api.get("/admin/skills");
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to fetch skills" };
    }
};