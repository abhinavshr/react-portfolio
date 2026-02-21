import api from "./api";

/**
 * Education Service
 * Provides API interaction methods for managing education records.
 */

/**
 * Fetches all education entries with pagination.
 * @param {number} page - The page number to retrieve.
 * @returns {Promise<Object>} The API response containing education data and pagination metadata.
 */
export const viewAllEducations = async (page = 1) => {
  try {
    const response = await api.get(`/admin/educations?page=${page}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch educations" };
  }
};

/**
 * Adds a new education entry.
 * @param {Object} educationData - The academic details (institution, level, etc.).
 * @returns {Promise<Object>} The API response.
 */
export const addEducation = async (educationData) => {
  try {
    const response = await api.post("/admin/educations", educationData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to add education" };
  }
};

/**
 * Fetches a single education entry by its ID.
 * @param {string|number} id - The ID of the education record.
 * @returns {Promise<Object>} The API response containing the education details.
 */
export const viewEducationById = async (id) => {
  try {
    const response = await api.get(`/admin/educations/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch education" };
  }
};

/**
 * Updates an existing education entry.
 * @param {string|number} id - The ID of the record to update.
 * @param {Object} educationData - The updated academic data.
 * @returns {Promise<Object>} The API response.
 */
export const updateEducation = async (id, educationData) => {
  try {
    const response = await api.put(`/admin/educations/${id}`, educationData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to update education" };
  }
};

/**
 * Deletes an education record from the system.
 * @param {string|number} id - The ID of the record to delete.
 * @returns {Promise<Object>} The API response.
 */
export const deleteEducation = async (id) => {
  try {
    const response = await api.delete(`/admin/educations/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to delete education" };
  }
};