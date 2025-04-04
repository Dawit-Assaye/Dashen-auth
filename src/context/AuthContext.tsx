"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type AuthStep = "userName" | "pin";

interface AuthContextType {
  step: AuthStep;
  setStep: (step: AuthStep) => void;
  userName: string;
  setUserName: (userName: string) => void;
  otpToken: string | null;
  setOtpToken: (otpToken: string | null) => void;
  otpCode: string | null;
  setOtpCode: (otpCode: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState<AuthStep>("userName");
  const [userName, setUserName] = useState("");
  const [otpToken, setOtpToken] = useState<string | null>(null);
  const [otpCode, setOtpCode] = useState<string | null>(null);

  return (
    <AuthContext.Provider
      value={{
        step,
        setStep,
        userName,
        setUserName,
        otpToken,
        setOtpToken,
        otpCode,
        setOtpCode,
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
