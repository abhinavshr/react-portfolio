import api from "./api";

export const viewAllExperiences = async () => {
    try {
        const response = await api.get("/admin/experiences");
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
