/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useAuth } from "../context/AuthContext";
import PinForm from "./PinForm";
import { useFormik } from "formik";
import axios from "axios";
import { useState } from "react";
import Input from "./ui/Input";
import Button from "./ui/Button";
import OtpInput from "./ui/OtpInput";

export default function OtpForm() {
  const {
    step,
    otpCode,
    otpToken,
    setStep,
    setUserName,
    setOtpToken,
    setOtpCode,
  } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);

  const loginForm = useFormik({
    initialValues: {
      userName: "",
      otp: otpCode || "",
    },
    validate: (values) => {
      const errors: { userName?: string; otp?: string } = {};
      if (!values.userName) {
        errors.userName = "Username is required";
      }
      if (showOtpField && !values.otp) {
        errors.otp = "OTP is required";
      } else if (showOtpField && !/^\d{6}$/.test(values.otp)) {
        errors.otp = "OTP must be a 6-digit number";
      }
      return errors;
    },
    onSubmit: async (values) => {
      setIsLoading(true);
      setError(null);

      const userName = values.userName.trim();

      try {
        if (!showOtpField) {
          // Step 1: Request OTP
          const response = await axios.post(
            "https://sau.eaglelionsystems.com/v1.0/chatbirrapi/cpsauth/otp/request/dashops",
            {
              user_name: userName,
              send_option: "email",
            },
            {
              headers: {
                sourceapp: "dashportal",
                otpfor: "login",
                "Content-Type": "application/json",
              },
            }
          );

          if (response.data.status === true) {
            setUserName(userName);
            setOtpToken(response.data.accesstoken);
            setOtpCode(response.data.otpcode);
            loginForm.setFieldValue("otp", response.data.otpcode);
            setShowOtpField(true);
          } else {
            throw new Error(response.data.message || "Failed to request OTP");
          }
        } else {
          // Step 2: Verify OTP
          if (!otpCode) {
            throw new Error("No OTP code available. Please request a new OTP.");
          }

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
            setOtpToken(response.data.accesstoken);
            setStep("pin");
          } else {
            throw new Error("No access token returned from OTP verification");
          }
        }
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message ||
          "An error occurred. Please try again.";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex">
      {/* Left Side */}
      <div className="w-1/2 bg-primary flex items-center justify-center">
        <h1 className="text-white text-4xl font-bold">
          Welcome to <br />
          DASHEN SUPER APP DASHBOARD
        </h1>
      </div>

      {/* Right Side */}
      <div className="w-1/2 flex flex-col items-center justify-center p-8 gap-6 bg-background text-foreground">
        <img src="/dashen_logo.png" alt="Dashen Bank" className="h-24 mr-2" />
        <div className="flex items-center flex-col gap-3">
          <h2 className="text-2xl font-bold">LOGIN</h2>
          <p className="text-gray-600 ">Welcome to Dashen bank dashboard!</p>
        </div>

        {step === "userName" && (
          <form onSubmit={loginForm.handleSubmit} className="w-full max-w-sm">
            <div className="relative">
              <Input
                label="User Name"
                name="userName"
                onChange={loginForm.handleChange}
                value={loginForm.values.userName}
                placeholder="Enter your username"
                disabled={isLoading}
                error={
                  loginForm.touched.userName && loginForm.errors.userName
                    ? loginForm.errors.userName
                    : undefined
                }
              />
              {!showOtpField && (
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isLoading}
                  disabled={isLoading || !!loginForm.errors.userName}
                  className="absolute right-1 top-[1.7rem]"
                >
                  Get OTP
                </Button>
              )}
            </div>
            {showOtpField && (
              <OtpInput
                value={loginForm.values.otp}
                onChange={(value) => loginForm.setFieldValue("otp", value)}
                disabled={isLoading}
                error={
                  loginForm.touched.otp && loginForm.errors.otp
                    ? loginForm.errors.otp
                    : undefined
                }
              />
            )}
            {showOtpField && (
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                disabled={isLoading || !!loginForm.errors.otp}
                className="w-full mt-4"
              >
                Next
              </Button>
            )}
            {error && (
              <>
                <p className="text-red-500 text-sm">{error}</p>
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    loginForm.resetForm();
                    setShowOtpField(false);
                    setOtpCode(null);
                  }}
                  className="text-blue-900 text-sm mt-2"
                >
                  Try a different username
                </button>
              </>
            )}
            <p className="text-right text-sm text-blue-900 mt-2 cursor-pointer">
              Forget PIN?
            </p>
          </form>
        )}

        {step === "pin" && <PinForm />}
      </div>
    </div>
  );
}
