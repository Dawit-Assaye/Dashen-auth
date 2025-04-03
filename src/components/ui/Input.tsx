import { InputHTMLAttributes, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({
  label,
  error,
  className,
  type = "text",
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div className="relative">
      {label && (
        <label className="block text-gray-400 text-sm font-bold mb-1">
          {label}
        </label>
      )}
      <input
        type={inputType}
        className={`w-full border rounded-md p-2 pr-10 disabled:opacity-50 ${
          error ? "border-destructive" : "border-gray-300"
        } ${className}`}
        {...props}
      />
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-2 top-[2.5rem] transform -translate-y-1/4 text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      )}
      {error && <p className="text-destructive text-sm mt-1">{error}</p>}
    </div>
  );
}
