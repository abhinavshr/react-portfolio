import api from "./api";

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


