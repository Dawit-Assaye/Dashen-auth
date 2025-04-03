import { useState, useRef, useEffect } from "react";

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
}

export default function OtpInput({
  value,
  onChange,
  disabled,
  error,
}: OtpInputProps) {
  const [otpValues, setOtpValues] = useState<string[]>(
    value ? value.split("") : Array(6).fill("")
  );
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const currentValue = otpValues.join("");
    if (value !== currentValue) {
      setOtpValues(value ? value.split("") : Array(6).fill(""));
    }
  }, [value]);

  const handleChange = (index: number, inputValue: string) => {
    if (/^\d?$/.test(inputValue)) {
      const newOtpValues = [...otpValues];
      newOtpValues[index] = inputValue;
      setOtpValues(newOtpValues);
      onChange(newOtpValues.join(""));

      if (inputValue && index < 5) {
        otpRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace") {
      if (!otpValues[index]) {
        if (index > 0) {
          const newOtpValues = [...otpValues];
          newOtpValues[index - 1] = "";
          setOtpValues(newOtpValues);
          onChange(newOtpValues.join(""));
          otpRefs.current[index - 1]?.focus();
        }
      } else {
        const newOtpValues = [...otpValues];
        newOtpValues[index] = "";
        setOtpValues(newOtpValues);
        onChange(newOtpValues.join(""));
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      otpRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const pastedDigits = pastedData.replace(/\D/g, "").slice(0, 6);

    if (pastedDigits) {
      const newOtpValues = Array(6).fill("");
      for (let i = 0; i < pastedDigits.length; i++) {
        newOtpValues[i] = pastedDigits[i];
      }
      setOtpValues(newOtpValues);
      onChange(newOtpValues.join(""));

      const nextEmptyIndex = pastedDigits.length < 6 ? pastedDigits.length : 5;
      otpRefs.current[nextEmptyIndex]?.focus();
    }
  };

  return (
    <>
      <div className="flex justify-between w-full ">
        {otpValues.map((val, index) => (
          <input
            key={index}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={val}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={index === 0 ? handlePaste : undefined}
            className={`w-12 h-10 border bg-gray-300 text-primary rounded-md text-center text-lg disabled:opacity-50 ${
              error ? "border-destructive " : "border-primary"
            }`}
            disabled={disabled}
            ref={(el) => {
              otpRefs.current[index] = el;
            }}
          />
        ))}
      </div>
      {error && <p className="text-destructive text-sm mt-1">{error}</p>}
    </>
  );
}
