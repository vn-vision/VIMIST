import React, { useState, useEffect } from 'react'
import { useDisplayNotifications } from '../features/notifications/notificationsHook';
import { IoNotifications, IoNotificationsOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

function CounterNotification() {
    const [unreadCount, setUnreadCount] = useState(0);
    const {data: NotificationData} = useDisplayNotifications();
    const navigate = useNavigate();
    // get the unread count
    useEffect(() => {
        if (NotificationData) {
          setUnreadCount(NotificationData.filter((n) => !n.read_at).length);
        }
      }, [NotificationData]);
  return (
    <div className="vn-relative vn-cursor-pointer" onClick={()=>navigate("/reports")}>
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
  )
}

export default CounterNotification;
