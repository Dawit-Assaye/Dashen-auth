"use client";
import { useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import OtpForm from "../../../../components/OtpForm";
import PinForm from "../../../../components/PinForm";

export default function LoginPage() {
  const [step, setStep] = useState<"phone" | "otp" | "pin">("phone");

  const phoneForm = useFormik({
    initialValues: {
      phoneNumber: "",
    },
    onSubmit: async (values) => {
      try {
        await axios.post(
          "https://sau.eaglelionsystems.com/v1.0/chatbirrapi/cpsauth/otp/request/dashops",
          {
            user_name: values.phoneNumber,
            send_option: "email",
          },
          {
            headers: {
              sourceapp: "dashportal",
              otpfor: "login",
            },
          }
        );
        setStep("otp");
      } catch (error) {
        console.error("OTP request failed:", error);
      }
    },
  });

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
      <div className="w-1/2 flex flex-col items-center justify-center p-8 bg-background">
        <div className="flex items-center mb-8">
          <img src="/dashen-logo.png" alt="Dashen Bank" className="h-12 mr-2" />
          <h2 className="text-2xl font-bold text-foreground">LOGIN</h2>
        </div>

        <p className="text-gray-600 mb-4">
          Welcome Come to Dashen bank dashboard!
        </p>

        {step === "phone" && (
          <form onSubmit={phoneForm.handleSubmit} className="w-full max-w-sm">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Phone Number
              </label>
              <div className="flex items-center border rounded p-2">
                <img
                  src="/ethiopia-flag.png"
                  alt="Ethiopia Flag"
                  className="h-5 mr-2"
                />
                <span className="mr-2">+251 -</span>
                <input
                  type="text"
                  name="phoneNumber"
                  onChange={phoneForm.handleChange}
                  value={phoneForm.values.phoneNumber}
                  className="w-full outline-none"
                  placeholder="0000000000"
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-blue-900 text-white px-4 py-2 rounded"
            >
              Get OTP
            </button>
          </form>
        )}

        {step === "otp" && <OtpForm setStep={setStep} />}
        {step === "pin" && <PinForm />}
      </div>
    </div>
  );
}
