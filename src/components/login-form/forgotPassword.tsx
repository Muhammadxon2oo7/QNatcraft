
"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

import { Mail } from "../../../public/img/auth/Mail";
import { Lock } from "../../../public/img/auth/lock";
import { OpenEye } from "../../../public/img/auth/openEye";
import { Eye, EyeOff } from "lucide-react";

const ForgotPassword = ({ setIsForgotPassword }: { setIsForgotPassword: (value: boolean) => void }) => {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState(new Array(6).fill(""));
  const [generatedCode, setGeneratedCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const [isResendDisabled, setIsResendDisabled] = useState(false);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsResendDisabled(false); // Vaqt tugasa, qayta yuborishni faollashtirish
    }
  }, [timeLeft]);

  const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const generateFakeCode = () => {
    const fakeCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(fakeCode);
    toast(`Tasdiqlash kodingiz: ${fakeCode}`);
    setTimeLeft(30);
    setIsResendDisabled(true);
  };

  const handleEmailSubmit = async () => {
    setLoading(true);
    if (!isValidEmail(email)) {
      toast.error("Iltimos, to‘g‘ri email kiriting!");
      setLoading(false);
      return;
    }
    if (email === "fake@example.com") {
      generateFakeCode();
      setStep("verify");
    } else {
      toast.error("Bu email ro‘yxatda yo‘q.");
    }
    setLoading(false);
  };


  const handlePasswordReset = () => {
    if (newPassword.length < 6) {
      toast.error("Parol kamida 6 ta belgidan iborat bo‘lishi kerak!");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Parollar mos kelmadi!");
      return;
    }
    toast.success("Parolingiz muvaffaqiyatli yangilandi!");
    setIsForgotPassword(false);
  };
  
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d{6}$/.test(pasted)) return;
  
    setVerificationCode(pasted.split(""));
    inputs.current[5]?.focus();
  };
  
  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);
  
    if (value && index < 5) {  // fix: index should be less than 5 to focus next input
      inputs.current[index + 1]?.focus();
    }
  };
  
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      const newCode = [...verificationCode];
  
      if (!newCode[index] && index > 0) {
        inputs.current[index - 1]?.focus();
      } else {
        newCode[index] = "";
        setVerificationCode(newCode);
      }
    }
  };


 

  const handleCodeSubmit = () => {
    if (verificationCode.join("") === generatedCode) {
      setStep("reset");
    } else {
      toast.error("Noto‘g‘ri kod! Qayta urinib ko‘ring.");
    }
  };


  const isEmailValid = isValidEmail(email);
  const isCodeValid = verificationCode.join("").length === 6;
  const isPasswordValid = newPassword.length > 6 && newPassword == confirmPassword;

  const handleKeyDownGlobal = (e: React.KeyboardEvent<HTMLInputElement>, step: string) => {
    if (e.key === "Enter") {
      if (step === "email") {
        handleEmailSubmit();
      } else if (step === "verify") {
        handleCodeSubmit();
      } else if (step === "reset") {
        handlePasswordReset();
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-8">
      {step === "email" && (
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold text-center">Qayta tiklash</h1>
          <p className="text-center text-muted-foreground">
            Parolni qayta tiklash uchun tizimda ro'yhatdan o'tgan email pochtangizni kiriting!
          </p>
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center">
              <Mail />
            </div>
            <Input
              type="email"
              placeholder="Email pochta"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => handleKeyDownGlobal(e, "email")}
              className="rounded-[16px] p-4 w-full pl-10 h-[54px] bg-[#f6f6f6]"
            />
          </div>
          <Button
            className="w-full rounded-[16px] h-[52px] flex justify-center items-center hover:primary-bg"
            onClick={handleEmailSubmit}
            disabled={!isEmailValid || loading}
          >
            {loading ? "Yuborilmoqda..." : "Parolni tiklash"}
          </Button>
        </div>
      )}

      {step === "verify" && (
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold text-center">Tasdiqlash</h1>
          <p className="text-center text-muted-foreground">
            Tasdiqlash uchun <span className="text-[#8B1D1D]">{email}</span> raqamiga yuborilgan sms kodni
            kiriting!
          </p>
          <div className="grid grid-cols-6 gap-2">
          {verificationCode.map((digit, index) => (
        <input
          key={index}
          ref={(el: HTMLInputElement | null) => {
            inputs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          className="md:w-12 md:h-12 w-10 h-10 text-center border rounded-xl bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none"
          value={digit}
          onChange={(e) => handleCodeChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          autoFocus={index === 0}
          aria-label={`Kod ${index + 1}-raqami`}
        />
      ))}
          </div>
          <div className="text-center text-xl font-medium">00:{timeLeft.toString().padStart(2, "0")}</div>
          <Button
            className="w-full rounded-[16px] h-[52px] flex justify-center items-center hover:primary-bg"
            onClick={handleCodeSubmit}
            disabled={!isCodeValid || loading}
          >
            {loading ? "Yuborilmoqda..." : "Tasdiqlash"}
          </Button>
          <button
            className="w-full text-center mt-2 text-[#C72525] text-xs"
            disabled={isResendDisabled}
            onClick={generateFakeCode}
          >
            Kodni qayta yuborish
          </button>
        </div>
      )}

      {step === "reset" && (
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold text-center">Yangi parol</h1>
          <p className="text-center text-muted-foreground">
            Yangi parolni kiriting
          </p>
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center">
              <Lock />
            </div>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Yangi parol"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              onKeyDown={(e) => handleKeyDownGlobal(e, "reset")}
              className="rounded-[16px] p-4 w-full pl-10 h-[54px] bg-[#f6f6f6]"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center">
              <Lock />
            </div>
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Parolni tasdiqlang"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyDown={(e) => handleKeyDownGlobal(e, "reset")}
              className="rounded-[16px] p-4 w-full pl-10 h-[54px] bg-[#f6f6f6]"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
          <Button
            className="w-full rounded-[16px] h-[52px] flex justify-center items-center hover:primary-bg"
            onClick={handlePasswordReset}
            disabled={!isPasswordValid || loading}
          >
            {loading ? "Yuborilmoqda..." : "Parolni yangilash"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
