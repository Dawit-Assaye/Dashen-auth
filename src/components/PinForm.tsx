/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useFormik } from "formik";
import { signIn } from "next-auth/react";
import { useAuth } from "../context/AuthContext";

export default function PinForm() {
  const { userName, otpToken, setStep } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const pinForm = useFormik({
    initialValues: {
      pin: "",
    },
    validate: (values) => {
      const errors: { pin?: string } = {};
      if (!values.pin) {
        errors.pin = "PIN is required";
      }
      return errors;
    },
    onSubmit: async (values) => {
      setIsLoading(true);
      setError(null);

      if (!otpToken) {
        setError("No access token found. Please start the process again.");
        setIsLoading(false);
        setStep("userName");
        return;
      }

      try {
        console.log("Attempting to sign in with:", {
          userName,
          otpToken,
          pin: values.pin,
        });
        const result = await signIn("credentials", {
          userName,
          otpToken,
          pin: values.pin,
          callbackUrl: "/dashboard", // Let NextAuth.js handle the redirect
        });

        console.log("Sign-in result:", result);

        if (result?.error) {
          setError(result.error);
          console.error("Sign-in error:", result.error);
        } else {
          console.log(
            "Sign-in successful, NextAuth.js should redirect to /dashboard"
          );
          // No manual redirect needed since callbackUrl is specified
        }
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred");
        console.error("Login failed:", err);
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <form onSubmit={pinForm.handleSubmit} className="w-full max-w-sm">
      {error && (
        <div className="mb-4">
          <p className="text-red-500 text-sm">{error}</p>
          <button
            type="button"
            onClick={() => {
              setError(null);
              pinForm.resetForm();
              setStep("userName");
            }}
            className="text-blue-900 text-sm mt-2"
          >
            Go back to username
          </button>
        </div>
      )}
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
        {pinForm.touched.pin && pinForm.errors.pin && (
          <p className="text-red-500 text-sm mt-1">{pinForm.errors.pin}</p>
        )}
      </div>
      <button
        type="submit"
        className="bg-blue-900 text-white px-4 py-2 rounded w-full disabled:opacity-50"
        disabled={isLoading || !!pinForm.errors.pin}
      >
        {isLoading ? "Signing In..." : "Sign In"}
      </button>
      <p className="text-right text-sm text-blue-900 mt-2 cursor-pointer">
        Forget PIN?
      </p>
    </form>
  );
}
