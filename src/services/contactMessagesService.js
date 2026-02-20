import api from "./api";

/**
 * Contact Messages Service
 * Handles all API requests related to contact messages in the admin panel.
 */

/**
 * Fetches all contact messages with pagination support.
 * @param {number} page - The page number to retrieve.
 * @returns {Promise<Object>} The API response containing messages and pagination info.
 */
export const viewAllContactMessages = async (page = 1) => {
  try {
    const response = await api.get(`/admin/contacts?page=${page}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch contact messages" };
  }
};

/**
 * Fetches the details of a specific contact message by its ID.
 * @param {string|number} id - The unique ID of the contact message.
 * @returns {Promise<Object>} The API response containing the message details.
 */
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

/**
 * Marks a contact message as 'read'.
 * @param {string|number} id - The unique ID of the contact message.
 * @returns {Promise<Object>} The API response.
 */
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

/**
 * Deletes a contact message from the system.
 * @param {string|number} id - The unique ID of the contact message.
 * @returns {Promise<Object>} The API response.
 */
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