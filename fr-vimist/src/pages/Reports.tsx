import {
  useDisplayNotifications,
  useUpdateNotification,
} from "../features/notifications/notificationsHook";
import Notification from "../components/Notification";

function Reports() {
  // set state for different actions in reports
  const { data: NotificationData } = useDisplayNotifications();
  const { updateNotification } = useUpdateNotification();

  console.log("Notifications ", NotificationData);

  return (
    <div className="vn-flex vn-flex-col vn-h-full vn-gap-5 vn-mt-5">
      <h1>Reports</h1>
      <button> {'<<<<'} Back</button>
      <ul className="vn-flex vn-flex-col vn-list-inside vn-text-md vn-gap-1">
        {NotificationData?.map((notification) => (
          <li key={notification.id}>
            <Notification
              id={notification.id}
              type={notification.type}
              message={notification.message}
              read_at={notification.read_at?.toString()}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Reports;
