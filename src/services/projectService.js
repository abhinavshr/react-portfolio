/**
 * @file projectService.js
 * @description API service functions for managing professional projects.
 */

import api from "./api";

/**
 * Fetches all projects with pagination.
 * @param {number} page - The page number to retrieve.
 * @returns {Promise<Object>} The paginated projects list and metadata.
 */
export const viewAllProjects = async (page = 1) => {
  try {
    const response = await api.get(`/admin/projects?page=${page}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch projects" };
  }
};

/**
 * Retrieves a single project by its ID.
 * @param {number|string} id - The unique identifier of the project.
 * @returns {Promise<Object>} The project details.
 */
export const viewProjectById = async (id) => {
  try {
    const response = await api.get(`/admin/projects/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch project" };
  }
};

/**
 * Adds a new project.
 * @param {Object} projectData - The project details to be created.
 * @returns {Promise<Object>} The created project record.
 */
export const addProject = async (projectData) => {
  try {
    const response = await api.post("/admin/projects", projectData);
    return response.data;
  } catch (error) {
    throw new Error("Error adding project: " + error.message);
  }
};

/**
 * Updates an existing project.
 * @param {number|string} id - The ID of the project to update.
 * @param {Object} projectData - The updated project details.
 * @returns {Promise<Object>} The updated project record.
 */
export const updateProject = async (id, projectData) => {
  try {
    const response = await api.put(`/admin/projects/${id}`, projectData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to update project" };
  }
};

/**
 * Deletes a project record.
 * @param {number|string} id - The ID of the project to delete.
 * @returns {Promise<Object>} Success message and response data.
 */
export const deleteProject = async (id) => {
  try {
    const response = await api.delete(`/admin/projects/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to delete project" };
  }
};

/**
 * Fetches project categories for selection.
 * @returns {Promise<Array>} List of categories with id and name.
 */
export const fetchCategories = async () => {
  try {
    const response = await api.get("/admin/categories");
    return response.data.categories.map(cat => ({ id: cat.id, name: cat.name }));
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch categories" };
  }
};

