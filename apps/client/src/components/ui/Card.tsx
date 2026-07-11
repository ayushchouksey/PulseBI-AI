import { type HTMLAttributes, forwardRef } from "react";
import { classNames } from "@pulsebi/shared-utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ hover = false, padding = "md", className, children, ...props }, ref) => {
    const paddings = { none: "", sm: "p-4", md: "p-6", lg: "p-8" };

    return (
      <div
        ref={ref}
        className={classNames(
          "bg-white rounded-2xl border border-surface-200 shadow-card transition-all duration-200",
          hover && "hover:shadow-card-hover hover:border-surface-300 hover:-translate-y-0.5 cursor-pointer",
          paddings[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
