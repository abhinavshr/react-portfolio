import api from "./api";

/**
 * Experience Responsibilities Service
 * Manages individual responsibility items associated with a work experience record.
 */

/**
 * Adds a batch of responsibilities to a specific experience.
 * @param {string|number} experienceId - The ID of the parent experience.
 * @param {Object} payload - Object containing an array of responsibility strings.
 * @returns {Promise<Object>} The API response.
 */
export const addResponsibilities = async (experienceId, payload) => {
  try {
    const response = await api.post(
      `/admin/experiences/${experienceId}/responsibilities`,
      payload
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: "Failed to add responsibilities"
    };
  }
};

/**
 * Deletes a single responsibility item.
 * @param {string|number} id - The ID of the responsibility to delete.
 * @returns {Promise<Object>} The API response.
 */
export const deleteResponsibility = async (id) => {
  try {
    const response = await api.delete(`/admin/responsibilities/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: "Failed to delete responsibility",
    };
  }
};

/**
 * Updates an existing responsibility item.
 * @param {string|number} id - The ID of the responsibility to update.
 * @param {Object} payload - Object containing the updated responsibility string.
 * @returns {Promise<Object>} The API response.
 */
export const updateResponsibility = async (id, payload) => {
  try {
    const response = await api.put(`/admin/responsibilities/${id}`, payload);
    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: "Failed to update responsibility",
    };
  }
};


