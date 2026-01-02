import api from "./api";

export const viewAllEducations = async () => {
    try {
        const response = await api.get("/admin/educations");
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to fetch educations" };
    }
};