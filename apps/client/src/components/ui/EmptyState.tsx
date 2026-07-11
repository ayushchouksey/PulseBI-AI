import { AlertTriangle, Search, Inbox, FileText } from "lucide-react";

interface EmptyStateProps {
  variant?: "no-data" | "no-results" | "error" | "default";
  title: string;
  description: string;
  action?: React.ReactNode;
}

const icons = {
  "no-data": FileText,
  "no-results": Search,
  error: AlertTriangle,
  default: Inbox,
};

export function EmptyState({ variant = "default", title, description, action }: EmptyStateProps) {
  const Icon = icons[variant];

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-surface-100 flex items-center justify-center mb-4">
        <Icon className="h-8 w-8 text-surface-400" />
      </div>
      <h3 className="text-lg font-semibold text-surface-900 mb-2">{title}</h3>
      <p className="text-sm text-surface-500 max-w-sm mb-6">{description}</p>
      {action}
    </div>
  );
}
