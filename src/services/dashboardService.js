import api from "./api";

/**
 * Fetches the total number of projects.
 * @returns {Promise<Object>} Object containing the total projects count.
 */
export const getTotalProjects = async () => {
  const response = await api.get("/admin/total-projects");
  return response.data;
};

/**
 * Fetches the total number of skills across all categories.
 * @returns {Promise<Object>} Object containing skill statistics.
 */
export const getTotalSkills = async () => {
  const response = await api.get("/admin/total-skills");
  return response.data;
};

/**
 * Fetches the total years of professional experience.
 * @returns {Promise<Object>} Object containing experience metrics.
 */
export const getTotalExperience = async () => {
  const response = await api.get("/admin/total-experiences");
  return response.data;
};

/**
 * Fetches the total number of certificates earned.
 * @returns {Promise<Object>} Object containing certificate counts.
 */
export const getTotalCertificates = async () => {
  const response = await api.get("/admin/total-certificates");
  return response.data;
};

/**
 * Fetches the total number of contact messages received.
 * @returns {Promise<Object>} Object containing contact counts.
 */
export const getTotalContacts = async () => {
  const response = await api.get("/admin/total-contacts");
  return response.data;
};

/**
 * Retrieves a list of recently created projects for the dashboard preview.
 * @returns {Promise<Object>} Object containing a list of recent projects.
 */
export const getRecentProjects = async () => {
  const response = await api.get("/admin/recent-projects");
  return response.data;
};

/**
 * Retrieves a list of recently received contact messages for the dashboard preview.
 * @returns {Promise<Object>} Object containing a list of recent contacts.
 */
export const getRecentContacts = async () => {
  const response = await api.get("/admin/recent-contacts");
  return response.data;
};
