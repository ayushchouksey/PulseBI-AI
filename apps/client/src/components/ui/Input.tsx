import { type InputHTMLAttributes, forwardRef } from "react";
import { classNames } from "@pulsebi/shared-utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-surface-700">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={classNames(
            "w-full px-4 py-2.5 bg-white border border-surface-200 rounded-xl text-surface-900",
            "placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent",
            "transition-all duration-150",
            error && "border-danger focus:ring-danger",
            className
          )}
          {...props}
        />
        {error && <p className="text-sm text-danger">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
