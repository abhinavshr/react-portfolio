import api from "./api";

/**
 * Fetches the admin's profile and about information.
 * @returns {Promise<Object>} The admin profile data including basic info, stats, and social links.
 * @throws {Object} Error response data if the request fails.
 */
export const getAdminProfileAbout = async () => {
  try {
    const response = await api.get("/admin/admin-info");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch profile about" };
  }
};

/**
 * Updates the admin's basic information (phone, professional title, tagline, about me).
 * @param {Object} payload - The basic information to update.
 * @param {string} [payload.phone_number] - Admin's phone number.
 * @param {string} [payload.professional_title] - Professional title (e.g., Full Stack Developer).
 * @param {string} [payload.tagline] - Short punchy tagline.
 * @param {string} [payload.about_me] - Detailed biography.
 * @returns {Promise<Object>} The updated profile data.
 * @throws {Object} Error response data if the update fails.
 */
export const updateAdminBasicInfo = async (payload) => {
  try {
    const response = await api.put(
      "/admin/admin-info/basic-info",
      payload
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to update basic info" };
  }
};

/**
 * Updates the admin's portfolio statistics (experience, projects, clients, etc.).
 * @param {Object} payload - The statistics to update.
 * @param {number} [payload.years_of_experience] - Total years of experience.
 * @param {number} [payload.projects_completed] - Total number of projects.
 * @param {number} [payload.happy_clients] - Number of satisfied clients.
 * @param {number} [payload.technologies_used] - Number of technologies mastered.
 * @returns {Promise<Object>} The updated portfolio statistics.
 * @throws {Object} Error response data if the update fails.
 */
export const updateAdminStatistic = async (payload) => {
  try {
    const response = await api.put(
      "/admin/admin-info/portfolio-stats",
      payload
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to update statistics" };
  }
};

/**
 * Updates the admin's social media and professional profile links.
 * @param {Object} payload - The social links to update.
 * @param {string} [payload.github_url] - GitHub profile URL.
 * @param {string} [payload.linkedin_url] - LinkedIn profile URL.
 * @param {string} [payload.cv_url] - Link to CV or Resume.
 * @param {string} [payload.twitter_url] - Twitter/X profile URL.
 * @returns {Promise<Object>} The updated social links.
 * @throws {Object} Error response data if the update fails.
 */
export const updateAdminSocialLinks = async (payload) => {
  try {
    const response = await api.put(
      "/admin/admin-info/social-links",
      payload
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to update social links" };
  }
};
