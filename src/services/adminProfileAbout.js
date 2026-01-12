import api from "./api";

export const getAdminProfileAbout = async () => {
  try {
    const response = await api.get("/admin/admin-info");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch profile about" };
  }
};

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

export const updateAdminStatistic = async (payload) => {
  try {
    const response = await api.put(
      "/admin/admin-info/portfolio-stats",
      payload
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to update basic info" };
  }
};