import api from "./api";

export const viewAllEducations = async () => {
    try {
        const response = await api.get("/admin/educations");
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to fetch educations" };
    }
};

export const addEducation = async (educationData) => {
  try {
    const response = await api.post("/admin/educations", educationData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to add education" };
  }
};
