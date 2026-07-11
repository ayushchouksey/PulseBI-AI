import { classNames } from "@pulsebi/shared-utils";

interface BadgeProps {
  variant: "success" | "warning" | "danger" | "info" | "default";
  children: React.ReactNode;
  size?: "sm" | "md";
}

const variantStyles = {
  success: "bg-success-light text-success-dark",
  warning: "bg-warning-light text-warning-dark",
  danger: "bg-danger-light text-danger-dark",
  info: "bg-info-light text-info-dark",
  default: "bg-surface-100 text-surface-600",
};

export function Badge({ variant, children, size = "sm" }: BadgeProps) {
  return (
    <span
      className={classNames(
        "inline-flex items-center rounded-full font-medium",
        variantStyles[variant],
        size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm"
      )}
    >
      {children}
    </span>
  );
}
