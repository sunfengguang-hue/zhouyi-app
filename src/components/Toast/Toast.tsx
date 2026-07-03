import React, { useEffect } from 'react';
import './Toast.css';

export interface ToastData {
  id: number;
  message: string;
  type?: 'success' | 'error' | 'info';
}

interface ToastProps {
  toasts: ToastData[];
  onDismiss: (id: number) => void;
}

const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastData; onDismiss: (id: number) => void }> = ({
  toast,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 2500);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const icon = toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : 'ℹ';

  return (
    <div
      className={`toast toast--${toast.type || 'info'}`}
      onClick={() => onDismiss(toast.id)}
    >
      <span className="toast__icon">{icon}</span>
      <span className="toast__message">{toast.message}</span>
    </div>
  );
};

export default Toast;
