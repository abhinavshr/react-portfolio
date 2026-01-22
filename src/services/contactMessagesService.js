import api from "./api";

export const viewAllContactMessages = async (page = 1) => {
  try {
    const response = await api.get(`/admin/contacts?page=${page}`);
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

export const deleteContactMessage = async (id) => {
    try {
        const response = await api.delete(`/admin/contacts/${id}`, {
            headers: {
                Accept: "application/json",
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to delete contact message" };
    }
};