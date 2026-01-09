import api from "./api";

export const viewAdminSettings = async () => {
    try {
        const response = await api.get("/admin/profile");
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to fetch admin settings" };
    }
};