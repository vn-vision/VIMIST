import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { useEffect } from "react";
import { Notification } from "../../api/notificationAPI";
import { fetchNotificationById, fetchNotifications, addNewNotification, modifyNotification, removeNotification } from "./notificationsSlice";

// Hook to display notifications
export const useDisplayNotifications = () => {
  const dispatch = useDispatch<AppDispatch>();
  const notifications = useSelector((state: RootState) => state.notifications.notifications || []);
  const status = useSelector((state: RootState) => state.notifications.status);
  const error = useSelector((state: RootState) => state.notifications.error);

  useEffect(() => {
    if (notifications.length === 0) {
      dispatch(fetchNotifications());
    }
  }, [dispatch, notifications.length]);

  return { data: notifications, status, error };
};

// Hook to get a specific notification by ID
export const useDisplayNotificationById = (id: number) => {
  const dispatch = useDispatch<AppDispatch>();
  const notification = useSelector((state: RootState) => state.notifications.notifications || []);
  const status = useSelector((state: RootState) => state.notifications.status);
  const error = useSelector((state: RootState) => state.notifications.error);

  useEffect(() => {
    if (notification === null) {
      dispatch(fetchNotificationById(id));
    }
  }, [dispatch, id, notification]);

  return { data: notification, status, error };
};

// Hook to add a new notification
export const useAddNewNotification = () => {
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector((state: RootState) => state.notifications.status);
  const error = useSelector((state: RootState) => state.notifications.error);

  const addNotification = (notification: Notification) => {
    dispatch(addNewNotification(notification));
  };

  return { addNotification, status, error };
};

// Hook to update a notification
export const useUpdateNotification = () => {
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector((state: RootState) => state.notifications.status);
  const error = useSelector((state: RootState) => state.notifications.error);

  const updateNotification = (notification: Notification) => {
    dispatch(modifyNotification(notification));
  };

    return { updateNotification, status, error };

}

// Hook to delete a notification
export const useDeleteNotification = () => {
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector((state: RootState) => state.notifications.status);

  const deleteNotification = (id: number) => {
    dispatch(removeNotification(id));
  };

  return { deleteNotification, status };
};