import axios from "axios";

//  define interface for notification
export interface Notification {
  id: number;
  type: string;
  message: string;
  read_at: Date;
}

const baseUrl = "http://localhost:8000/api/notifications/notifications";


// get all notifications
export const getNotifications = async () => {
  try {
    const response = await axios.get(`${baseUrl}/`);
    return response.data.Notifications;
  } catch (error) {
    console.error("Error fetching notifications", error);
    throw error;
  }
};

//  get a notification by id
export const getNotificationById = async (id: number) => {
  try {
    const response = await axios.get(`${baseUrl}/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Error while getting the notification", error);
    throw error;
  }
};

export const postNotification = async (notification: Notification) => {
  try {
    const myToken = sessionStorage.getItem("accessToken");
    const response = await axios.post(`${baseUrl}/`, notification, {
      headers: {
        Authorization: `Bearer ${myToken}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error while adding the notification", error);
    throw error;
  }
};

export const updateNotification = async (notification: Notification) => {
  try {
    const myToken = sessionStorage.getItem("accessToken");
    const response = await axios.put(
      `${baseUrl}/${notification.id}/`,
      notification,
      {
        headers: {
          Authorization: `Bearer ${myToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error while updating the notification", error);
    throw error;
  }
};

export const deleteNotification = async (id: number) => {
  try {
    const myToken = sessionStorage.getItem("accessToken");
    const response = await axios.delete(`${baseUrl}/${id}/`, {
      headers: {
        Authorization: `Bearer ${myToken}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error while deleting the notification", error);
    throw error;
  }
};
