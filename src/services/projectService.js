import api from "./api";

export const viewAllProjects = async () => {
  try {
    const response = await api.get("/admin/projects");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch projects" };
  }
};

export const viewProjectById = async (id) => {
  try {
    const response = await api.get(`/admin/projects/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch project" };
  }
};


export const addProject = async (projectData) => {
  try {
    const response = await api.post("/admin/projects", projectData);
    return response.data; 
  } catch (error) {
    throw new Error("Error adding project: " + error.message);
  }
};

export const updateProject = async (id, projectData) => {
  try {
    const response = await api.put(`/admin/projects/${id}`, projectData);
    return response.data; 
  } catch (error) {
    throw error.response?.data || { message: "Failed to update project" };
  }
};


export const fetchCategories = async () => {
  try {
    const response = await api.get("/admin/categories");
    return response.data.categories.map(cat => ({ id: cat.id, name: cat.name }));
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch categories" };
  }
};
