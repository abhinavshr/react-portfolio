import api from "./api";

export const viewAdminSettings = async () => {
    try {
        const response = await api.get("/admin/profile");
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to fetch admin settings" };
    }
};

export const updateAdminProfilePhoto = async (photo) => {
  try {
    const formData = new FormData();
    formData.append("profile_photo", photo);

    const response = await api.post(
      "/admin/profile/photo",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to update profile photo" };
  }
};

export const updateAdminProfile = async ({ name, email }) => {
  try {
    const response = await api.put("/admin/profile", {
      name,
      email,
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to update profile" };
  }
};