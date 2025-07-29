import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "default", 
  children, 
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-secondary text-white hover:brightness-110 focus:ring-primary shadow-lg hover:shadow-elevated",
    accent: "bg-gradient-to-r from-accent to-yellow-400 text-gray-900 hover:brightness-110 focus:ring-accent shadow-lg hover:shadow-elevated",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary",
    ghost: "text-gray-600 hover:text-primary hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800",
    danger: "bg-gradient-to-r from-error to-red-600 text-white hover:brightness-110 focus:ring-error shadow-lg"
  };
  
  const sizes = {
    sm: "h-8 px-3 text-sm rounded-md",
    default: "h-10 px-4 text-sm rounded-lg",
    lg: "h-12 px-6 text-base rounded-lg",
    xl: "h-14 px-8 text-lg rounded-xl"
  };
  
  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;