import api from "./api";

/**
 * Certificates Service
 * Provides API interaction methods for managing professional certificates.
 */

/**
 * Fetches all certificates with pagination.
 * @param {number} page - The page number to retrieve.
 * @returns {Promise<Object>} The API response containing certificates and pagination metadata.
 */
export const viewAllCertificates = async (page = 1) => {
  try {
    const response = await api.get(`/admin/certificates?page=${page}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch certificates" };
  }
};

/**
 * Adds a new certificate to the system.
 * @param {Object} data - The certificate data (title, issuer, issue_date, etc.).
 * @returns {Promise<Object>} The API response.
 */
export const addCertificate = async (data) => {
  try {
    const response = await api.post("/admin/certificates", data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to add certificate" };
  }
}

/**
 * Fetches a single certificate's details by its ID.
 * @param {string|number} id - The ID of the certificate.
 * @returns {Promise<Object>} The API response containing the certificate details.
 */
export const viewCertificateById = async (id) => {
  try {
    const response = await api.get(`/admin/certificates/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch certificate" };
  }
};

/**
 * Updates an existing certificate's details.
 * @param {string|number} id - The ID of the certificate to update.
 * @param {Object} data - The updated certificate data.
 * @returns {Promise<Object>} The API response.
 */
export const updateCertificate = async (id, data) => {
  try {
    const response = await api.put(`/admin/certificates/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to update certificate" };
  }
};

/**
 * Deletes a certificate from the system.
 * @param {string|number} id - The ID of the certificate to delete.
 * @returns {Promise<Object>} The API response.
 */
export const deleteCertificate = async (id) => {
  try {
    const response = await api.delete(`/admin/certificates/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to delete certificate" };
  }
};