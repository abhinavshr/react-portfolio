/**
 * @file projectImageService.js
 * @description API service functions for managing project images and artifacts.
 */

import api from "./api";

/**
 * Fetches all project images with pagination.
 * @param {number} page - The page number to retrieve.
 * @returns {Promise<Object>} The paginated image list and metadata.
 * @throws {Object} Error response from the API.
 */
export const viewAllProjectImages = async (page = 1) => {
  try {
    const response = await api.get(`/admin/project-images?page=${page}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch project images" };
  }
};

/**
 * Retreives a single project image by its ID.
 * @param {number|string} id - The unique identifier of the project image.
 * @returns {Promise<Object>} The project image details.
 * @throws {Object} Error response from the API.
 */
export const getProjectImageById = async (id) => {
  try {
    const response = await api.get(`/admin/project-images/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch project image" };
  }
};

/**
 * Fetches names and IDs of projects for dropdown selection.
 * @returns {Promise<Object>} List of projects.
 * @throws {Object} Error response from the API.
 */
export const fetchProjectsDropdown = async () => {
  try {
    const response = await api.get("/admin/projects-dropdown");
    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: "Failed to fetch projects dropdown",
    };
  }
};

/**
 * Uploads a new project image.
 * @param {Object} params - The image details.
 * @param {number|string} params.project_id - The ID of the project to associate with.
 * @param {string} params.image_name - The display label for the image.
 * @param {File} params.image - The image file to upload.
 * @returns {Promise<Object>} The created image record.
 * @throws {Object} Error response from the API.
 */
export const uploadProjectImage = async ({ project_id, image_name, image }) => {
  try {
    const formData = new FormData();
    formData.append("project_id", project_id);
    formData.append("image_name", image_name);
    formData.append("image", image);

    const response = await api.post("/admin/project-images", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to upload project image" };
  }
};

/**
 * Updates an existing project image.
 * @param {Object} params - The updated image details.
 * @param {number|string} params.id - The unique identifier of the record to update.
 * @param {number|string} params.project_id - The ID of the project to associate with.
 * @param {string} params.image_name - The display label for the image.
 * @param {File} [params.image] - Optional new image file to replace the existing one.
 * @returns {Promise<Object>} The updated image record.
 * @throws {Object} Error response from the API.
 */
export const editProjectImage = async ({ id, project_id, image_name, image }) => {
  try {
    const formData = new FormData();
    formData.append("project_id", project_id);
    formData.append("image_name", image_name);

    if (image) {
      formData.append("image", image);
    }

    const response = await api.post(`/admin/project-images/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to edit project image" };
  }
};

/**
 * Deletes a project image record.
 * @param {number|string} id - The ID of the project image to delete.
 * @returns {Promise<Object>} Success message and response data.
 * @throws {Object} Error response from the API.
 */
export const deleteProjectImage = async (id) => {
  try {
    const response = await api.delete(`/admin/project-images/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to delete project image" };
  }
};

