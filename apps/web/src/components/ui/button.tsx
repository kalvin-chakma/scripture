import * as React from "react";
import { cn } from "../../lib/utils";

const VARIANTS = {
  default:
    "py-2 rounded-lg font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500/60",
  unstyled: "",
} as const;

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof VARIANTS;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ type = "button", variant = "default", className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(VARIANTS[variant], className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export default Button;
