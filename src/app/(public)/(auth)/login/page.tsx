/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useFormik } from "formik";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import OtpForm from "@/components/OtpForm";
import PinForm from "@/components/PinForm";

export default function LoginPage() {
  const { step, setStep, setUserName, setOtpToken } = useAuth();
  const { status } = useSession();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const userNameForm = useFormik({
    initialValues: {
      userName: "",
    },
    validate: (values) => {
      const errors: { userName?: string } = {};
      if (!values.userName) {
        errors.userName = "Username is required";
      }
      return errors;
    },
    onSubmit: async (values) => {
      setIsLoading(true);
      setError(null);

      const userName = values.userName.trim();

      try {
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
          setUserName(userName); // Store the userName in context
          setOtpToken(response.data.accesstoken); // Store the accesstoken for the next step
          setStep("otp");
        } else {
          throw new Error(response.data.message || "Failed to request OTP");
        }
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message ||
          "Failed to request OTP. Please try again.";
        setError(errorMessage);
        console.error(
          "OTP request failed:",
          error.response?.data || error.message
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  // Redirect authenticated users to the dashboard
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  // Show a loading state while checking the session
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-red-900"></div>
      </div>
    );
  }

  // If the user is authenticated, don't render the login form (they'll be redirected)
  if (status === "authenticated") {
    return null;
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side */}
      <div className="w-1/2 bg-blue-900 flex items-center justify-center">
        <h1 className="text-white text-4xl font-bold">
          Welcome to <br />
          DASHEN SUPER APP DASHBOARD
        </h1>
      </div>

      {/* Right Side */}
      <div className="w-1/2 flex flex-col items-center justify-center p-8 bg-background text-foreground gap-6">
        <img src="/dashen_logo.png" alt="Dashen Bank" className="h-24 mr-2" />
        <div className="flex items-center  flex-col">
          <h2 className="text-2xl font-bold">LOGIN</h2>
          <p className="text-gray-600 ">
            Welcome Come to Dashen bank dashboard!
          </p>
        </div>

        {step === "userName" && (
          <form
            onSubmit={userNameForm.handleSubmit}
            className="w-full max-w-sm flex flex-col gap-4"
          >
            {error && (
              <div>
                <p className="text-red-500 text-sm">{error}</p>
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    userNameForm.resetForm();
                  }}
                  className="text-blue-900 text-sm mt-2"
                >
                  Try a different username
                </button>
              </div>
            )}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Username
              </label>
              <input
                type="text"
                name="userName"
                onChange={userNameForm.handleChange}
                value={userNameForm.values.userName}
                className="w-full border rounded p-2"
                placeholder="Enter your username"
                disabled={isLoading}
              />
              {userNameForm.touched.userName &&
                userNameForm.errors.userName && (
                  <p className="text-red-500 text-sm mt-1">
                    {userNameForm.errors.userName}
                  </p>
                )}
            </div>
            <button
              type="submit"
              className="bg-blue-900 text-white px-4 py-2 rounded w-full disabled:opacity-50"
              disabled={isLoading || !!userNameForm.errors.userName}
            >
              {isLoading ? "Requesting OTP..." : "Get OTP"}
            </button>
          </form>
        )}

        {step === "otp" && <OtpForm />}
        {step === "pin" && <PinForm />}
      </div>
    </div>
  );
}
