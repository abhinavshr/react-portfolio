import api from "./api";

/**
 * Fetches all technical skills with pagination.
 * 
 * @param {number} [page=1] - The page number to fetch.
 * @returns {Promise<Object>} The API response data containing skills and pagination info.
 * @throws {Object} Error object with message if the request fails.
 */
export const viewAllSkills = async (page = 1) => {
  try {
    const response = await api.get(`/admin/skills?page=${page}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch skills" };
  }
};

/**
 * Adds a new technical skill.
 * 
 * @param {Object} skillData - The skill data to be added (name, level, category_id).
 * @returns {Promise<Object>} The API response data for the created skill.
 * @throws {Object} Error object with message if the request fails.
 */
export const addSkill = async (skillData) => {
  try {
    const response = await api.post("/admin/skills", skillData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to add skill" };
  }
};

/**
 * Retrieves a specific technical skill by its ID.
 * 
 * @param {number|string} id - The unique identifier of the skill.
 * @returns {Promise<Object>} The API response data for the requested skill.
 * @throws {Object} Error object with message if the request fails.
 */
export const viewSkillById = async (id) => {
  try {
    const response = await api.get(`/admin/skills/${id}`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch skill" };
  }
};

/**
 * Updates an existing technical skill.
 * 
 * @param {number|string} id - The unique identifier of the skill to update.
 * @param {Object} skillData - The updated skill data.
 * @returns {Promise<Object>} The API response data for the updated skill.
 * @throws {Object} Error object with message if the request fails.
 */
export const updateSkill = async (id, skillData) => {
  try {
    const response = await api.put(`/admin/skills/${id}`, skillData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to update skill" };
  }
};

/**
 * Deletes a technical skill by its ID.
 * 
 * @param {number|string} id - The unique identifier of the skill to delete.
 * @returns {Promise<Object>} The API response data confirming deletion.
 * @throws {Object} Error object with message if the request fails.
 */
export const deleteSkill = async (id) => {
  try {
    const response = await api.delete(`/admin/skills/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to delete skill" };
  }
};
