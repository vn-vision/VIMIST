import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Notification, getNotifications, getNotificationById, postNotification, updateNotification, deleteNotification } from "../../api/notificationAPI";

// Define type for initial state
interface NotificationState {
    notifications: Notification[];
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

//  create thunks to get notifications,
export const fetchNotifications = createAsyncThunk<Notification[], void>(
    "notifications/fetchNotifications",
    async () => {
      try {
        const response = await getNotifications();
        return response;
      } catch (error: any) {
        return error.message || "Failed to fetch notifications";
      }
    }
  );
  
  // get a single notification
  export const fetchNotificationById = createAsyncThunk<
    Notification,
    number,
    { rejectValue: string }
    >(
      "notifications/fetchNotificationById",
      async (id, { rejectWithValue }) => {
        try {
          const response = await getNotificationById(id);
          return response;
        } catch (error: any) {
          return rejectWithValue(error.message || "Failed to fetch notification");
        }
      }
    );
  
  //   add a notification
  export const addNewNotification = createAsyncThunk<Notification, Notification, { rejectValue: string }>(
      "notifications/addNewNotification",
      async (notification, { rejectWithValue }) => {
          try {
          const response = await postNotification(notification);
          return response;
          } catch (error: any) {
          return rejectWithValue(error.message || "Failed to add notification");
          }
      }
  );
  
  // update a notification
  export const modifyNotification = createAsyncThunk<Notification, Notification, { rejectValue: string }>(
      "notifications/updateNotification",
      async (notification, { rejectWithValue }) => {
          try {
          const response = await updateNotification(notification);
          return response;
          } catch (error: any) {
          return rejectWithValue(error.message || "Failed to update notification");
          }
      }
  );
  
  // delete a notification
  export const removeNotification = createAsyncThunk<number, number, { rejectValue: string }>(
      "notifications/removeNotification",
      async (id, { rejectWithValue }) => {
          try {
          const response = await deleteNotification(id);
          return response;
          } catch (error: any) {
          return rejectWithValue(error.message || "Failed to delete notification");
          }
      }
  );
  
  
  // create the initial state
  const initialState: NotificationState = {
    notifications: [],
    status: 'idle',
    error: null,
  };
  
  // create the notifications slice
  
  const notificationSlice = createSlice({
      name:'notifications',
      initialState,
      reducers: {},
      extraReducers: (builder) => {
          builder
  
          // Handle status notifications
          .addCase(fetchNotifications.pending, (state) => {
              state.status = 'loading';
          })
          .addCase(fetchNotifications.fulfilled, (state, action) => {
              state.status = 'succeeded';
              state.notifications = action.payload;
          })
          .addCase(fetchNotifications.rejected, (state, action) => {
              state.status = 'failed';
              state.error = action.error.message || 'Failed to load notifications';
          })
  
          // handle status a single notification
          .addCase(fetchNotificationById.pending, (state) => {
              state.status = 'loading';
          })
          .addCase(fetchNotificationById.fulfilled, (state, action) => {
              state.status = 'succeeded';
              state.notifications = [action.payload];
          })
          .addCase(fetchNotificationById.rejected, (state, action) => {
              state.status = 'failed';
              state.error = action.error.message || 'Failed to load notification';
          })
  
          // handle adding a notification
          .addCase(addNewNotification.pending, (state) => {
              state.status = 'loading';
          })
          .addCase(addNewNotification.fulfilled, (state, action) => {
              state.status = 'succeeded';
              state.notifications.push(action.payload);
          })
          .addCase(addNewNotification.rejected, (state, action) => {
              state.status = 'failed';
              state.error = action.error.message || 'Failed to add notification';
          })
  
          // handle updating a notification
          .addCase(modifyNotification.pending, (state) => {
              state.status = 'loading';
          })
          .addCase(modifyNotification.fulfilled, (state, action) => {
              state.status = 'succeeded';
              const index = state.notifications.findIndex((notification) => notification.id === action.payload.id);
              if (index !== -1) {
                  state.notifications[index] = action.payload;
              }
          })
          .addCase(modifyNotification.rejected, (state, action) => {
              state.status = 'failed';
              state.error = action.error.message || 'Failed to update notification';
          })
  
          // handle deleting a notification
          .addCase(removeNotification.pending, (state) => {
              state.status = 'loading';
          })
          .addCase(removeNotification.fulfilled, (state, action) => {
              state.status = 'succeeded';
              state.notifications = state.notifications.filter((notification) => notification.id !== action.payload);
          })
          .addCase(removeNotification.rejected, (state, action) => {
              state.status = 'failed';
              state.error = action.error.message || 'Failed to delete notification';
          })
      }
  });
  
  export default notificationSlice.reducer;