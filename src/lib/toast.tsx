import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  duration: number;
}

class ToastManager {
  private toasts: ToastMessage[] = [];
  private listeners: ((toasts: ToastMessage[]) => void)[] = [];

  subscribe(listener: (toasts: ToastMessage[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this.toasts));
  }

  private add(type: ToastType, message: string, duration: number = 3000) {
    const id = `${Date.now()}-${Math.random()}`;
    const toast: ToastMessage = { id, type, message, duration };

    this.toasts.push(toast);
    this.notify();

    setTimeout(() => {
      this.remove(id);
    }, duration);
  }

  private remove(id: string) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.notify();
  }

  success(message: string, duration?: number) {
    this.add('success', message, duration);
  }

  error(message: string, duration?: number) {
    this.add('error', message, duration);
  }

  warning(message: string, duration?: number) {
    this.add('warning', message, duration);
  }

  info(message: string, duration?: number) {
    this.add('info', message, duration);
  }
}

export const toast = new ToastManager();

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    return toast.subscribe(setToasts);
  }, []);

  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-semantic-success" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-semantic-error" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-semantic-warning" />;
      case 'info':
        return <Info className="h-5 w-5 text-semantic-info" />;
    }
  };

  const getStyles = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-semantic-success';
      case 'error':
        return 'bg-red-50 border-semantic-error';
      case 'warning':
        return 'bg-yellow-50 border-semantic-warning';
      case 'info':
        return 'bg-blue-50 border-semantic-info';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-3 p-4 rounded-md border-l-4 shadow-lg ${getStyles(t.type)} animate-slide-in pointer-events-auto`}
        >
          {getIcon(t.type)}
          <p className="text-sm font-medium text-text-primary">{t.message}</p>
        </div>
      ))}
    </div>
  );
};
