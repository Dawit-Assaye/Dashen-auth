"use client";
import { useAuth } from "../context/AuthContext";
import { useFormik } from "formik";
import Input from "./ui/Input";
import Button from "./ui/Button";
import OtpInput from "./ui/OtpInput";
import PinForm from "./PinForm";
import { useAuthApi } from "@/hooks/useAuthApi";
import { useState } from "react";

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
  const { requestOtp, verifyOtp, isLoading, error, setError } = useAuthApi();
  const [showOtpField, setShowOtpField] = useState(false);

  const loginForm = useFormik({
    initialValues: {
      userName: "",
      otp: otpCode || "",
    },
    validate: (values) => {
      const errors: { userName?: string; otp?: string } = {};
      if (!values.userName) errors.userName = "Username is required";
      if (showOtpField && !values.otp) errors.otp = "OTP is required";
      else if (showOtpField && !/^\d{6}$/.test(values.otp))
        errors.otp = "OTP must be a 6-digit number";
      return errors;
    },
    onSubmit: async (values) => {
      const userName = values.userName.trim();
      try {
        if (!showOtpField) {
          const result = await requestOtp(userName);
          setUserName(userName);
          setOtpToken(result.accessToken);
          setOtpCode(result.otpCode);
          loginForm.setFieldValue("otp", result.otpCode);
          setShowOtpField(true);
        } else {
          if (!otpCode) throw new Error("No OTP code available.");
          await verifyOtp({ otpCode: values.otp, otpToken: otpToken! });
          setStep("pin");
        }
      } catch (error: unknown) {
        // Error is handled by useAuthApi hook via onError callback
      }
    },
  });

  if (step === "pin") return <PinForm />;

  return (
    <form
      onSubmit={loginForm.handleSubmit}
      className="w-full max-w-sm flex flex-col gap-4"
    >
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
  );
}
