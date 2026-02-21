import api from "./api";

/**
 * Experience Service
 * Provides API interaction methods for managing work experience records.
 */

/**
 * Fetches all experience entries with pagination.
 * @param {number} page - The page number to retrieve.
 * @returns {Promise<Object>} The API response containing experience data and pagination metadata.
 */
export const viewAllExperiences = async (page = 1) => {
  try {
    const response = await api.get(`/admin/experiences?page=${page}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch experiences" };
  }
};

/**
 * Fetches a single experience entry by its ID.
 * @param {string|number} id - The ID of the experience.
 * @returns {Promise<Object>} The API response containing the experience details.
 */
export const viewExperienceById = async (id) => {
  try {
    const response = await api.get(`/admin/experiences/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch experience" };
  }
};

/**
 * Adds a new experience entry.
 * @param {Object} experienceData - The experience data (company_name, role, etc.).
 * @returns {Promise<Object>} The API response.
 */
export const addExperience = async (experienceData) => {
  try {
    const response = await api.post(
      "/admin/experiences",
      experienceData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: "Failed to add experience",
    };
  }
};

/**
 * Updates an existing experience entry.
 * @param {string|number} id - The ID of the experience to update.
 * @param {Object} experienceData - The updated experience data.
 * @returns {Promise<Object>} The API response.
 */
export const updateExperience = async (id, experienceData) => {
  try {
    const response = await api.put(`/admin/experiences/${id}`, experienceData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to update experience" };
  }
};

/**
 * Deletes an experience entry from the system.
 * @param {string|number} id - The ID of the experience to delete.
 * @returns {Promise<Object>} The API response.
 */
export const deleteExperience = async (id) => {
  try {
    const response = await api.delete(`/admin/experiences/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to delete experience" };
  }
};