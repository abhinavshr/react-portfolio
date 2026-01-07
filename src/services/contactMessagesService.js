import api from "./api";

export const viewAllContactMessages = async () => {
    try {
        const response = await api.get("/admin/contacts");
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to fetch contact messages" };
    }
};

export const viewContactMessageById = async (id) => {
  try {
    const response = await api.get(`/admin/contacts/${id}`, {
      headers: {
        Accept: "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: "Failed to fetch contact message",
    };
  }
};

export const markContactAsRead = async (id) => {
  try {
    const response = await api.patch(
      `/admin/contacts/${id}/read`,
      {},
      {
        headers: {
          Accept: "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: "Failed to mark contact as read",
    };
  }
};