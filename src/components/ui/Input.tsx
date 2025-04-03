import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({
  label,
  error,
  className,
  ...props
}: InputProps) {
  return (
    <>
      {label && (
        <label className="block text-gray-400 text-sm font-bold mb-1">
          {label}
        </label>
      )}
      <input
        className={`w-full border rounded-md p-2 disabled:opacity-50 ${
          error ? "border-destructive" : "border-gray-300"
        } ${className}`}
        {...props}
      />
      {error && <p className="text-destructive text-sm mt-1">{error}</p>}
    </>
  );
}
