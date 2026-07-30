"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, leftIcon, rightIcon, ...props }, ref) => {
    if (!leftIcon && !rightIcon) {
      return (
        <input
          type={type}
          className={cn(
            "flex h-11 w-full rounded-xl border border-input bg-card/70 px-4 py-2 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:border-primary/60 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
      );
    }
    return (
      <div className={cn("relative flex items-center", className)}>
        {leftIcon && (
          <span className="pointer-events-none absolute left-3.5 flex text-muted-foreground [&>svg]:h-4.5 [&>svg]:w-4.5">
            {leftIcon}
          </span>
        )}
        <input
          type={type}
          className={cn(
            "flex h-11 w-full rounded-xl border border-input bg-card/70 pl-10 pr-4 py-2 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:border-primary/60 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-50",
            rightIcon && "pr-10"
          )}
          ref={ref}
          {...props}
        />
        {rightIcon && (
          <span className="absolute right-3.5 flex text-muted-foreground [&>svg]:h-4.5 [&>svg]:w-4.5">
            {rightIcon}
          </span>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
