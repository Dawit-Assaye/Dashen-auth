/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function OtpForm() {
  const { setStep, setOtpToken, otpToken } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const otpForm = useFormik({
    initialValues: {
      otp: "",
    },
    validate: (values) => {
      const errors: { otp?: string } = {};
      if (!values.otp) {
        errors.otp = "OTP is required";
      } else if (!/^\d{6}$/.test(values.otp)) {
        errors.otp = "OTP must be a 6-digit number";
      }
      return errors;
    },
    onSubmit: async (values) => {
      setIsLoading(true);
      setError(null);

      if (!otpToken) {
        setError("No access token found. Please start the process again.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.post(
          "https://sau.eaglelionsystems.com/v1.0/chatbirrapi/cpsauth/otp/confirm/dashops",
          { otpcode: values.otp },
          {
            headers: {
              sourceapp: "dashportal",
              otpfor: "login",
              Authorization: `Bearer ${otpToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.accesstoken) {
          setOtpToken(response.data.accesstoken); // Update the accesstoken for the next step
          setStep("pin");
        } else {
          throw new Error("No access token returned from OTP verification");
        }
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message ||
          "Failed to verify OTP. Please try again.";
        setError(errorMessage);
        console.error(
          "OTP verification failed:",
          error.response?.data || error.message
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <form onSubmit={otpForm.handleSubmit} className="w-full max-w-sm">
      {error && (
        <div className="mb-4">
          <p className="text-red-500 text-sm">{error}</p>
          <button
            type="button"
            onClick={() => {
              setError(null);
              otpForm.resetForm();
              setStep("userName"); // Updated step name
            }}
            className="text-blue-900 text-sm mt-2"
          >
            Go back to username
          </button>
        </div>
      )}
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
          placeholder="Enter 6-digit OTP"
          disabled={isLoading}
        />
        {otpForm.touched.otp && otpForm.errors.otp && (
          <p className="text-red-500 text-sm mt-1">{otpForm.errors.otp}</p>
        )}
      </div>
      <button
        type="submit"
        className="bg-blue-900 text-white px-4 py-2 rounded w-full disabled:opacity-50"
        disabled={isLoading || !!otpForm.errors.otp}
      >
        {isLoading ? "Verifying..." : "Verify OTP"}
      </button>
    </form>
  );
}
