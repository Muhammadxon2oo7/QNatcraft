"use client";

import { useState, useEffect, useRef } from "react";
import { Check, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { confirmEmail } from "@/services/auth/confirm-email";
import Celebrate from "../../../public/img/auth/celebrate";
import { Resend } from "../../../public/img/auth/resend";

interface VerificationProps {
  setIsFormSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Verification({ setIsFormSubmitted }: VerificationProps) {
  const tauth = useTranslations("auth.confirm"); // "auth.confirm" obyektiga o‘tdik
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(34);
  const [error, setError] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      const parsedData = JSON.parse(userData);
      setEmail(parsedData.email);
    }
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
    setCanResend(true);
  }, [timeLeft]);

  useEffect(() => {
    if (code.every((digit) => digit)) handleVerify();
  }, [code]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError(false);

    if (value && index < 5) inputs.current[index + 1]?.focus();
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text").slice(0, 6);
    if (/^\d{6}$/.test(pasted)) {
      setCode(pasted.split(""));
      inputs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    const enteredCode = code.join("");
    setLoading(true);
    try {
      await confirmEmail({ confirmation_code: enteredCode, email });
      localStorage.removeItem("userData");
      toast.success(tauth("codeIsright"), { icon: <Celebrate /> }); // "auth.confirm" dan emas, "auth" dan olingan
      setTimeout(() => window.location.assign("/login"), 1500);
    } catch (error: any) {
      setError(true);
      toast.error(tauth("wrongCode")); // "auth.confirm.wrongCode" ishlatildi
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    setCode(["", "", "", "", "", ""]);
    setTimeLeft(34);
    setCanResend(false);
    setError(false);
    inputs.current[0]?.focus();
    toast.success(tauth("codeResended"), { icon: <Resend /> });
  };

  const handleChangeEmail = () => {
    localStorage.removeItem("userData");
    setIsFormSubmitted(false);
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold">{tauth("verifyTitle")}</h1>
        <p className="text-gray-600">
          {tauth("verifyText")}{" "}
          <span className="font-medium">{email}</span>
        </p>
      </div>

      <div className="flex justify-center gap-2">
        {code.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className={`w-12 h-12 text-center border rounded-xl focus:ring-2 focus:ring-red-500 outline-none ${
              error ? "border-red-500" : "border-gray-300"
            }`}
            aria-label={`Digit ${index + 1}`}
            disabled={loading}
          />
        ))}
      </div>

      {error && (
        <p className="text-center text-red-500">{tauth("wrongCode")}</p>
      )}

      <div className="text-center">
        {canResend ? (
          <Button
            onClick={handleResend}
            className="bg-red-800 hover:bg-red-900 text-white"
            disabled={loading}
          >
            {tauth("resend")}
            <RefreshCw className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <span className="text-lg">
            {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:
            {String(timeLeft % 60).padStart(2, "0")}
          </span>
        )}
      </div>

      <Button
        onClick={handleVerify}
        className="w-full h-12 bg-red-800 hover:bg-red-900 text-white rounded-xl"
        disabled={code.some((digit) => !digit) || loading}
      >
        {loading ? "Tasdiqlanmoqda..." : tauth("verifyButton")}
        <Check className="ml-2 h-5 w-5" />
      </Button>

      <p className="text-center">
        <button
          onClick={handleChangeEmail}
          className="text-red-800 hover:underline"
          disabled={loading}
        >
          {tauth("changeEmail")}
        </button>
      </p>
    </div>
  );
}