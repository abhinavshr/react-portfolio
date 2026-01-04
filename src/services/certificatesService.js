import api from "./api";

export const viewAllCertificates = async () => {
    try {
        const response = await api.get("/admin/certificates");
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to fetch certificates" };
    }
};