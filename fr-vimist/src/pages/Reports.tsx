import { useState, useEffect } from "react";
import { IoNotifications, IoNotificationsOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import {
  useDisplayNotifications,
  useUpdateNotification,
} from "../features/notifications/notificationsHook";
import Notification from "../components/Notification";

function Reports() {
  const { data: NotificationData } = useDisplayNotifications();
  const { updateNotification } = useUpdateNotification();
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
    <div className="vn-flex vn-flex-col vn-h-full vn-gap-5 vn-mt-5 vn-p-5 vn-w-2/3 vn-max-w-3xl vn-mx-auto">
      {/* Header with Notifications Icon */}
      <div className="vn-flex vn-items-center vn-justify-between">
        <h1 className="vn-text-2xl vn-font-bold">Reports</h1>

        <div className="vn-relative vn-cursor-pointer">
          {unreadCount > 0 ? (
            <IoNotifications className="vn-text-blue-600 vn-text-2xl" />
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

      {/* Back Button */}
      <button
        className="vn-text-blue-500 vn-font-medium vn-hover:underline"
        onClick={() => navigate("/")}
      >
        {'<<<<'} Back
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
  );
}

export default Reports;
