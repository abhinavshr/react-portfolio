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
