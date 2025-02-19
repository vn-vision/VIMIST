import { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";

type AlertMessageProps = {
  message: string;
  type: "success" | "error" | "warning" | "info";
  onClose: () => void;
};

const AlertMessage = ({ message, type = "info", onClose }: AlertMessageProps) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!show) return null;

  // Alert type colors
  const alertStyles = {
    success: "vn-bg-green-500 vn-text-white",
    error: "vn-bg-red-500 vn-text-white",
    warning: "vn-bg-yellow-500 vn-text-black",
    info: "vn-bg-blue-500 vn-text-white",
  };

  return (
    <div className={`vn-fixed vn-top-5 vn-right-0 vn-p-3 vn-px-5 vn-rounded-md vn-shadow-lg vn-flex vn-items-center vn-justify-between vn-transition-opacity vn-duration-300 ${alertStyles[type]}`}>
      <span>{message}</span>
      <button onClick={() => setShow(false)} className="ml-3">
        <IoMdClose className="vn-w-4 vn-h-4" />
      </button>
    </div>
  );
};

export default AlertMessage;
