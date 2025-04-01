"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type AuthStep = "phone" | "otp" | "pin";

interface AuthContextType {
  step: AuthStep;
  setStep: (step: AuthStep) => void;
  phoneNumber: string;
  setPhoneNumber: (phoneNumber: string) => void;
  otpToken: string | null;
  setOtpToken: (otpToken: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState<AuthStep>("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpToken, setOtpToken] = useState<string | null>(null);

  return (
    <AuthContext.Provider
      value={{
        step,
        setStep,
        phoneNumber,
        setPhoneNumber,
        otpToken,
        setOtpToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
