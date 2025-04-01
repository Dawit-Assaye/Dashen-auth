"use client";

import { useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function OtpForm() {
  const { setStep, setOtpToken } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const otpForm = useFormik({
    initialValues: {
      otp: "",
    },
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const response = await axios.post(
          "https://sau.eaglelionsystems.com/v1.0/chatbirrapi/cpsauth/otp/confirm/dashops",
          { otpcode: values.otp },
          {
            headers: {
              sourceapp: "dashportal",
              otpfor: "login",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
            },
          }
        );
        if (response.data.token) {
          setOtpToken(response.data.token); // Store the OTP token in context
        }
        setError(null);
        setStep("pin");
      } catch (error: any) {
        console.error("OTP verification failed:", error);
        setError(
          error.response?.data?.message ||
            "Failed to verify OTP. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <form onSubmit={otpForm.handleSubmit} className="w-full max-w-sm">
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Enter OTP
        </label>
        <input
          type="text"
          name="otp"
          onChange={otpForm.handleChange}
          value={otpForm.values.otp}
          className="w-full border rounded p-2"
          placeholder="Enter OTP"
          disabled={isLoading}
        />
      </div>
      <button
        type="submit"
        className="bg-blue-900 text-white px-4 py-2 rounded w-full disabled:opacity-50"
        disabled={isLoading}
      >
        {isLoading ? "Verifying..." : "Verify OTP"}
      </button>
    </form>
  );
}
