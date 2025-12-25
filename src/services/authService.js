import api from "./api";

export const adminLogin = async (email, password) => {
  try {
    const response = await api.post("/admin/login", {
      email,
      password,
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Login failed" };
  }
};