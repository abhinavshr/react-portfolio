import api from "./api";

export const viewAllCertificates = async (page = 1) => {
  try {
    const response = await api.get(`/admin/certificates?page=${page}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch certificates" };
  }
};

export const addCertificate = async (data) => {
  try {
    const response = await api.post("/admin/certificates", data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to add certificate" };
  }
}

export const viewCertificateById = async (id) => {
  try {
    const response = await api.get(`/admin/certificates/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch certificate" };
  }
};

export const updateCertificate = async (id, data) => {
  try {
    const response = await api.put(`/admin/certificates/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to update certificate" };
  }
};

export const deleteCertificate = async (id) => {
  try {
    const response = await api.delete(`/admin/certificates/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to delete certificate" };
  }
};