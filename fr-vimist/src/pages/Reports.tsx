import { useState, useEffect } from "react";
import { IoNotifications, IoNotificationsOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import {
  useDisplayNotifications,
  useUpdateNotification,
  useClearMessages
} from "../features/notifications/notificationsHook";
import Notification from "../components/Notification";
import AlertMessage from "../components/AlertMessage";

function Reports() {
  const { data: NotificationData } = useDisplayNotifications();
  const { updateNotification, message: updMsg, error: updErr} = useUpdateNotification();
  const { clsMessages } = useClearMessages();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  // Update unread count when notifications change
  useEffect(() => {
    if (NotificationData) {
      setUnreadCount(NotificationData.filter((n) => !n.read_at).length);
    }
  }, [NotificationData]);

  const handleMarkAsRead = (id: number, type: string, message: string) => {
    updateNotification({ id, type, message, read_at: new Date() });

    // Optimistically update unread count
    setUnreadCount((prev) => (prev > 0 ? prev - 1 : 0));
  };

  return (
    <div className="vn-min-h-full  vn-p-5">
      {updErr && <AlertMessage message={updErr} type="error" onClose={clsMessages} />}
      {updMsg && <AlertMessage message={updMsg} type="success" onClose={clsMessages} />}
      <div className="vn-flex vn-items-center vn-justify-between">
        <h1 className="vn-text-2xl vn-font-bold">Reports</h1>
        <div className="vn-relative vn-cursor-pointer">
          {unreadCount > 0 ? (
            <IoNotifications className="vn-text-primary vn-text-2xl" />
          ) : (
            <IoNotificationsOutline className="vn-text-gray-400 vn-text-2xl" />
          )}
          {unreadCount > 0 && (
            <span className="vn-absolute vn-top-0 vn-right-0 vn-bg-red-500 vn-text-white vn-text-xs vn-font-bold vn-px-2 vn-rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
      </div>

      <div className="vn-flex vn-flex-col vn-gap-5 vn-p-5 vn-w-2/3 vn-max-w-3xl vn-mx-auto">
        {/* Header with Notifications Icon */}

        {/* Back Button */}
        <button
          className="vn-bg-secondary vn-font-medium vn-hover:underline"
          onClick={() => navigate("/")}
        >
          {"<<<<"} Back
        </button>

        {/* Notification List */}
        <ul className="vn-flex vn-flex-col vn-gap-3">
          {NotificationData?.map((notification) => (
            <li key={notification.id}>
              <Notification
                id={notification.id}
                type={notification.type}
                message={notification.message}
                read_at={notification.read_at}
                onMarkAsRead={handleMarkAsRead}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Reports;
