import api from "./api";

export const viewAllExperiences = async (page = 1) => {
  try {
    const response = await api.get(`/admin/experiences?page=${page}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch experiences" };
  }
};

export const viewExperienceById = async (id) => {
    try {
        const response = await api.get(`/admin/experiences/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to fetch experience" };
    }
};

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

export const updateExperience = async (id, experienceData) => {
  try {
    const response = await api.put(`/admin/experiences/${id}`, experienceData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to update experience" };
  }
};

export const deleteExperience = async (id) => {
  try {
    const response = await api.delete(`/admin/experiences/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to delete experience" };
  }
};