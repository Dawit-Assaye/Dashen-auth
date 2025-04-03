import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

const API_HOST = process.env.NEXT_PUBLIC_API_HOST;

export const useAuthApi = () => {
  const [error, setError] = useState<string | null>(null);

  const requestOtpMutation = useMutation({
    mutationFn: async (userName: string) => {
      const response = await axios.post(
        `${API_HOST}otp/request/dashops`,
        { user_name: userName, send_option: "email" },
        {
          headers: {
            sourceapp: "dashportal",
            otpfor: "login",
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.data.status) {
        throw new Error(response.data.message || "Failed to request OTP");
      }
      return {
        accessToken: response.data.accesstoken,
        otpCode: response.data.otpcode,
      };
    },
    onError: (error: unknown) => {
      setError((error as Error)?.message || "Failed to request OTP");
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async ({
      otpCode,
      otpToken,
    }: {
      otpCode: string;
      otpToken: string;
    }) => {
      const response = await axios.post(
        `${API_HOST}otp/confirm/dashops`,
        { otpcode: otpCode },
        {
          headers: {
            sourceapp: "dashportal",
            otpfor: "login",
            Authorization: `Bearer ${otpToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.data.accesstoken) {
        throw new Error("No access token returned from OTP verification");
      }
      return response.data.accesstoken;
    },
    onError: (error: unknown) => {
      setError((error as Error)?.message || "OTP verification failed");
    },
  });

  return {
    requestOtp: requestOtpMutation.mutateAsync,
    verifyOtp: verifyOtpMutation.mutateAsync,
    isLoading: requestOtpMutation.isPending || verifyOtpMutation.isPending,
    error,
    setError,
  };
};
