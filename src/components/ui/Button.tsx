import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  children: ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = "rounded-md text-white disabled:opacity-50";
  const variantStyles =
    variant === "primary"
      ? "bg-blue-900 hover:bg-blue-800"
      : "bg-gray-500 hover:bg-gray-600";
  const sizeStyles =
    size === "sm"
      ? "px-2 py-1 text-xs"
      : size === "md"
      ? "px-2 py-2 text-sm"
      : "px-6 py-3 text-base";

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
}
