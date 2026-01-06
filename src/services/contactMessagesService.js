import api from "./api";

export const viewAllContactMessages = async () => {
    try {
        const response = await api.get("/admin/contacts");
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to fetch contact messages" };
    }
};