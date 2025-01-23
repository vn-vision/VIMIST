interface NotificationProps {
  id: number;
  type: string;
  message: string;
  read_at: string | null;
}

function Notification({ id, type, message, read_at }: NotificationProps) {
  return (
      <div className="vn-flex vn-gap-5 vn-border vn-border-orange-100 vn-w-[90%] vn-h-[100%] vn-ml-5">
        <p>{id}</p>
        <p>{type}</p>
        <p>{message}</p>
        <p>
          {read_at ? (
            read_at
          ) : (
            <button className="vn-flex vn-justify-center vn-items-center">
              Mark_as_read
            </button>
          )}
        </p>
      </div>
  );
}

export default Notification;
