import api from "./api";

/**
 * Fetches all soft skills with pagination.
 * 
 * @param {number} page - The page number to fetch.
 * @returns {Promise<Object>} The API response data containing soft skills and pagination info.
 * @throws {Object} Error object with message if the request fails.
 */
export const viewAllSoftSkills = async (page = 1) => {
  try {
    const response = await api.get(`/admin/soft-skills?page=${page}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch soft skills" };
  }
};

/**
 * Adds a new soft skill.
 * 
 * @param {Object} skillData - The skill data to be added (name, description, level).
 * @returns {Promise<Object>} The API response data for the created soft skill.
 * @throws {Object} Error object with message if the request fails.
 */
export const addSoftSkill = async (skillData) => {
  try {
    const response = await api.post("/admin/soft-skills", skillData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to add soft skill" };
  }
};

/**
 * Retrieves a specific soft skill by its ID.
 * 
 * @param {number|string} id - The unique identifier of the soft skill.
 * @returns {Promise<Object>} The API response data for the requested soft skill.
 * @throws {Object} Error object with message if the request fails.
 */
export const getSoftSkillById = async (id) => {
  try {
    const response = await api.get(`/admin/soft-skills/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch soft skill" };
  }
};

/**
 * Updates an existing soft skill.
 * 
 * @param {number|string} id - The unique identifier of the soft skill to update.
 * @param {Object} skillData - The updated skill data.
 * @returns {Promise<Object>} The API response data for the updated soft skill.
 * @throws {Object} Error object with message if the request fails.
 */
export const updateSoftSkill = async (id, skillData) => {
  try {
    const response = await api.put(`/admin/soft-skills/${id}`, skillData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to update soft skill" };
  }
};

/**
 * Deletes a soft skill by its ID.
 * 
 * @param {number|string} id - The unique identifier of the soft skill to delete.
 * @returns {Promise<Object>} The API response data confirming deletion.
 * @throws {Object} Error object with message if the request fails.
 */
export const deleteSoftSkill = async (id) => {
  try {
    const response = await api.delete(`/admin/soft-skills/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to delete soft skill" };
  }
};
