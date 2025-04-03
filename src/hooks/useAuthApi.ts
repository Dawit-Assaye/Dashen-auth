import axios from "axios";
import { useState } from "react";

export const useAuthApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestOtp = async (userName: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        "https://sau.eaglelionsystems.com/v1.0/chatbirrapi/cpsauth/otp/request/dashops",
        { user_name: userName, send_option: "email" },
        {
          headers: {
            sourceapp: "dashportal",
            otpfor: "login",
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.status !== true) {
        throw new Error(response.data.message || "Failed to request OTP");
      }
      return {
        accessToken: response.data.accesstoken,
        otpCode: response.data.otpcode,
      };
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to request OTP");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (otpCode: string, otpToken: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        "https://sau.eaglelionsystems.com/v1.0/chatbirrapi/cpsauth/otp/confirm/dashops",
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
    } catch (err: any) {
      setError(err.response?.data?.message || "OTP verification failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { requestOtp, verifyOtp, isLoading, error, setError };
};
