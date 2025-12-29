import api from "./api";

export const viewAllProjectImages = async () => {
  try {
    const response = await api.get("/admin/project-images");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch project images" };
  }
};

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