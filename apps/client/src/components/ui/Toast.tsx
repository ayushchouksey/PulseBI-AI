import { useEffect, useState } from "react";
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from "lucide-react";
import { classNames } from "@pulsebi/shared-utils";

export interface Toast {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number;
}

interface ToastProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const styles = {
  success: "border-success/20 bg-success-light",
  error: "border-danger/20 bg-danger-light",
  warning: "border-warning/20 bg-warning-light",
  info: "border-info/20 bg-info-light",
};

const iconStyles = {
  success: "text-success",
  error: "text-danger",
  warning: "text-warning",
  info: "text-info",
};

function ToastItem({ toast, onDismiss }: ToastProps) {
  const Icon = icons[toast.type];

  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), toast.duration || 5000);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  return (
    <div className={classNames(
      "flex items-start gap-3 p-4 rounded-xl border shadow-lg animate-slide-down min-w-[320px] max-w-md",
      styles[toast.type]
    )}>
      <Icon className={classNames("h-5 w-5 mt-0.5 flex-shrink-0", iconStyles[toast.type])} />
      <div className="flex-1">
        <p className="text-sm font-medium text-surface-900">{toast.title}</p>
        {toast.message && <p className="text-sm text-surface-600 mt-0.5">{toast.message}</p>}
      </div>
      <button onClick={() => onDismiss(toast.id)} className="text-surface-400 hover:text-surface-600">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

let toastListener: ((toast: Toast) => void) | null = null;

export function showToast(type: Toast["type"], title: string, message?: string) {
  toastListener?.({
    id: crypto.randomUUID(),
    type,
    title,
    message,
  });
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    toastListener = (toast) => setToasts((prev) => [...prev, toast]);
    return () => { toastListener = null; };
  }, []);

  const dismiss = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />
      ))}
    </div>
  );
}
