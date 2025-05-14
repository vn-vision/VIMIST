import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { MdMarkAsUnread } from "react-icons/md";

interface NotificationProps {
  id: number;
  type: string;
  message: string;
  read_at: Date;
  onMarkAsRead: (id: number,   type: string, message: string) => void;
}

function Notification({ id, type, message, read_at, onMarkAsRead }: NotificationProps) {
  return (
    <div
      className={`vn-flex vn-items-center vn-justify-between vn-border vn-rounded-lg vn-p-4 vn-shadow-md vn-w-full ${
        read_at ? "vn-bg-white" : "vn-bg-secondary"
      }`}
    >
      <div className="vn-flex vn-flex-col vn-gap-1 vn-w-full">
        {/* Type Badge */}
        <span className="vn-text-xs vn-font-semibold vn-uppercase vn-bg-gray-200 vn-px-2 vn-py-1 vn-rounded">
          {type}
        </span>

        {/* Message */}
        <p className="vn-text-md vn-font-medium vn-text-gray-700">{message}</p>

        {/* Timestamp */}
        <span className="vn-text-xs vn-text-gray-500">
          {read_at ? `Read at: ${new Date(read_at).toLocaleString()}` : "Unread"}
        </span>
      </div>

      {/* Mark as Read Button */}
      {!read_at && (
        <button
          className="vn-text-primary vn-hover:text-blue-800 vn-transition"
          onClick={() => onMarkAsRead(id, type, message)}
          title="Mark as Read"
        >
          <MdMarkAsUnread size={20} />
        </button>
      )}
      {read_at && (
        <IoCheckmarkDoneSharp className="vn-text-green-500" size={20} title="Read" />
      )}
    </div>
  );
}

export default Notification;
