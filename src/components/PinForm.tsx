"use client";

import { useFormik } from "formik";
import { signIn } from "next-auth/react";
import { useAuth } from "../context/AuthContext";
import Input from "./ui/Input";
import Button from "./ui/Button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PinForm() {
  const router = useRouter();
  const { userName, otpToken, setStep } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const pinForm = useFormik({
    initialValues: { pin: "" },
    validate: (values) => {
      const errors: { pin?: string } = {};
      if (!values.pin) errors.pin = "PIN is required";
      return errors;
    },
    onSubmit: async (values) => {
      setIsLoading(true);
      setError(null);

      if (!otpToken) {
        setError("No access token found. Please start again.");
        setStep("userName");
        setIsLoading(false);
        return;
      }

      try {
        const result = await signIn("credentials", {
          userName,
          otpToken,
          pin: values.pin,
          callbackUrl: "/dashboard",
          redirect: false,
        });

        if (result?.error) setError("Invalid PIN. Please try again.");
        else if (result?.ok) router.push("/dashboard");
        else setError("An unexpected error occurred.");
      } catch (error: any) {
        setError(error?.message || "An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <form onSubmit={pinForm.handleSubmit} className="w-full max-w-sm">
      <Input
        label="Enter PIN"
        type="password"
        name="pin"
        onChange={pinForm.handleChange}
        value={pinForm.values.pin}
        placeholder="Enter PIN"
        disabled={isLoading}
        error={
          pinForm.touched.pin && pinForm.errors.pin
            ? pinForm.errors.pin
            : undefined
        }
      />
      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isLoading}
        disabled={isLoading || !!pinForm.errors.pin}
        className="w-full mt-4"
      >
        Sign In
      </Button>
      {error && (
        <div className="mt-4">
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
      <p className="text-right text-sm text-blue-900 mt-2 cursor-pointer">
        Forget PIN?
      </p>
    </form>
  );
}
