import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const bgColor = {
    success: 'bg-success-500',
    error: 'bg-error-500',
    info: 'bg-blue-500'
  };

  return (
    <div className={`fixed top-4 right-4 ${bgColor[type]} text-white px-4 py-2 rounded-lg shadow-lg z-50 max-w-sm`}>
      <div className="flex items-center justify-between">
        <span className="text-sm">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 text-white hover:text-gray-200"
          aria-label="Close notification"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default Toast;

