import api from "./api";

export const viewAllExperiences = async () => {
    try {
        const response = await api.get("/admin/experiences");
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to fetch experiences" };
    }
};

