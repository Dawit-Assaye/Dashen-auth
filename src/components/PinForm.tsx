"use client";

import { useState } from "react";
import { useFormik } from "formik";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function PinForm() {
  const router = useRouter();
  const { phoneNumber, otpToken } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const pinForm = useFormik({
    initialValues: {
      pin: "",
    },
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        if (!otpToken) {
          throw new Error(
            "No OTP token found. Please complete the OTP step again."
          );
        }

        const result = await signIn("credentials", {
          redirect: false,
          phoneNumber,
          otpToken,
          pin: values.pin,
        });

        if (result?.error) {
          setError(result.error);
        } else {
          router.push("/dashboard");
        }
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <form onSubmit={pinForm.handleSubmit} className="w-full max-w-sm">
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Enter PIN
        </label>
        <input
          type="password"
          name="pin"
          onChange={pinForm.handleChange}
          value={pinForm.values.pin}
          className="w-full border rounded p-2"
          placeholder="Enter PIN"
          disabled={isLoading}
        />
      </div>
      <button
        type="submit"
        className="bg-blue-900 text-white px-4 py-2 rounded w-full disabled:opacity-50"
        disabled={isLoading}
      >
        {isLoading ? "Signing In..." : "Sign In"}
      </button>
      <p className="text-right text-sm text-blue-900 mt-2 cursor-pointer">
        Forget PIN?
      </p>
    </form>
  );
}
