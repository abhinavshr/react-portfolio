import api from "./api";

/**
 * Fetches the current administrator's profile settings.
 * 
 * @returns {Promise<Object>} The administrator profile data.
 * @throws {Object} Error response from the API.
 */
export const viewAdminSettings = async () => {
  try {
    const response = await api.get("/admin/profile");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch admin settings" };
  }
};

/**
 * Updates the administrator's profile photo.
 * 
 * @param {File} photo - The image file to be uploaded.
 * @returns {Promise<Object>} The API response notification.
 * @throws {Object} Error response from the API.
 */
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

/**
 * Updates the administrator's personal profile information.
 * 
 * @param {Object} profileData - The data containing name and email.
 * @param {string} profileData.name - The full name of the administrator.
 * @param {string} profileData.email - The email address of the administrator.
 * @returns {Promise<Object>} The API response notification.
 * @throws {Object} Error response from the API.
 */
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

/**
 * Changes the administrator's account password.
 * 
 * @param {Object} passwordData - The password rotation payload.
 * @param {string} passwordData.current_password - The current password of the administrator.
 * @param {string} passwordData.new_password - The new password to be set.
 * @param {string} passwordData.new_password_confirmation - The confirmation of the new password.
 * @returns {Promise<Object>} The API response notification.
 * @throws {Object} Error response from the API.
 */
export const changeAdminPassword = async ({
  current_password,
  new_password,
  new_password_confirmation,
}) => {
  try {
    const response = await api.put("/admin/profile/password", {
      current_password,
      new_password,
      new_password_confirmation,
    });

    return response.data;
  } catch (error) {
    throw (
      error.response?.data || { message: "Failed to change password" }
    );
  }
};
