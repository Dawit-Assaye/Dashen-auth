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

  // Sync otpValues with external value prop only on initial mount
  // or when value changes from outside the component
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Only update if the new value is different from current internal state
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

      // Move focus to the next input
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
        // If current input is empty and backspace is pressed, move to previous input
        if (index > 0) {
          const newOtpValues = [...otpValues];
          newOtpValues[index - 1] = ""; // Clear the previous input
          setOtpValues(newOtpValues);
          onChange(newOtpValues.join(""));
          otpRefs.current[index - 1]?.focus();
        }
      } else {
        // If current input has a value, clear it but stay on the same input
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

  // Handle paste functionality
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

      // Focus on the next empty input or the last one
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
