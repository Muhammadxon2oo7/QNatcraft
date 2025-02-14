// "use client";

// import { useState, useEffect, useRef } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { toast } from "sonner";

// const ForgotPassword = ({ setIsForgotPassword }: { setIsForgotPassword: (value: boolean) => void }) => {
//   const [step, setStep] = useState(1);
//   const [email, setEmail] = useState("");
//   const [code, setCode] = useState(new Array(6).fill(""));
//   const [generatedCode, setGeneratedCode] = useState("");
//   const [timeLeft, setTimeLeft] = useState(30);
//   const [canResend, setCanResend] = useState(false);
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const inputs = useRef<(HTMLInputElement | null)[]>([]);

//   useEffect(() => {
//     if (timeLeft > 0) {
//       const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
//       return () => clearTimeout(timer);
//     } else {
//       setCanResend(true);
//     }
//   }, [timeLeft]);

//   const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

//   const generateFakeCode = () => {
//     const fakeCode = Math.floor(100000 + Math.random() * 900000).toString();
//     setGeneratedCode(fakeCode);
//     toast(`Tasdiqlash kodingiz: ${fakeCode}`);
//     setTimeLeft(30);
//     setCanResend(false);
//   };

//   const handleEmailSubmit = () => {
//     if (!isValidEmail(email)) {
//       toast.error("Iltimos, to‘g‘ri email kiriting!");
//       return;
//     }
//     if (email === "fake@example.com") {
//       generateFakeCode();
//       setStep(2);
//     } else {
//       toast.error("Bu email ro‘yxatda yo‘q.");
//     }
//   };

//   const handleCodeChange = (index: number, value: string) => {
//     if (/^\d?$/.test(value)) {
//       const newCode = [...code];
//       newCode[index] = value;
//       setCode(newCode);
//       if (value !== "" && index < 5) inputs.current[index + 1]?.focus();
//       if (value === "" && index > 0) inputs.current[index - 1]?.focus();
//     }
//   };

//   const handleCodeSubmit = () => {
//     if (code.join("") === generatedCode) {
//       setStep(3);
//     } else {
//       toast.error("Noto‘g‘ri kod! Qayta urinib ko‘ring.");
//     }
//   };

//   const handlePasswordReset = () => {
//     if (newPassword.length < 6) {
//       toast.error("Parol kamida 6 ta belgidan iborat bo‘lishi kerak!");
//       return;
//     }
//     if (newPassword !== confirmPassword) {
//       toast.error("Parollar mos kelmadi!");
//       return;
//     }
//     toast.success("Parolingiz muvaffaqiyatli yangilandi!");
//     setIsForgotPassword(false);
//   };

//   const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
//     e.preventDefault();
//     const pasted = e.clipboardData.getData("text").slice(0, 6);
//     if (!/^\d{6}$/.test(pasted)) return;

//     setCode(pasted.split(""));
//     inputs.current[5]?.focus();
//   };

//   const handleEditEmail = () => {
//     setStep(1); // Step 1'ga qaytish
//   };

//   // Buttonlar uchun shartlar
//   const isEmailValid = isValidEmail(email);
//   const isCodeValid = code.join("").length === 6;
//   const isPasswordValid = newPassword.length >= 6 && newPassword === confirmPassword;

//   return (
//     <div className="w-full max-w-md mx-auto p-6 space-y-8 bg-white shadow-md rounded-md">
//       {step === 1 && (
//         <div>
//           <h2 className="text-2xl font-semibold text-center">Emailingizni kiriting</h2>
//           <Label htmlFor="email" className="mt-4">Email</Label>
//           <Input
//             id="email"
//             type="email"
//             placeholder="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="w-full mt-2"
//           />
//           <Button 
//             onClick={handleEmailSubmit} 
//             className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
//             disabled={!isEmailValid}
//           >
//             Davom etish
//           </Button>
//         </div>
//       )}
//       {step === 2 && (
//         <div>
//           <h2 className="text-2xl font-semibold text-center">Tasdiqlash kodini kiriting</h2>
//           <div className="flex justify-between items-center mt-4">
//             <div className="w-full text-center">
//               <p>Email: <span className="font-semibold">{email}</span></p>
//               <Button onClick={handleEditEmail} className="mt-2 text-sm text-blue-600">Emailni tahrirlash</Button>
//             </div>
//             <div className="flex justify-center gap-2 mt-4">
//               {code.map((digit, index) => (
//                 <Input
//                   key={index}
//                   ref={(el) => (inputs.current[index] = el)}
//                   type="text"
//                   maxLength={1}
//                   className="w-12 text-center"
//                   value={digit}
//                   onChange={(e) => handleCodeChange(index, e.target.value)}
//                   onPaste={handlePaste}
//                   aria-label={`Kod ${index + 1}-raqami`}
//                 />
//               ))}
//             </div>
//           </div>
//           {canResend ? (
//             <Button 
//               onClick={generateFakeCode} 
//               className="mt-4 bg-blue-600 hover:bg-blue-700"
//             >
//               Qayta yuborish
//             </Button>
//           ) : (
//             <p className="text-center mt-2 text-gray-600">{timeLeft} soniya qoldi</p>
//           )}
//           <Button 
//             onClick={handleCodeSubmit} 
//             className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
//             disabled={!isCodeValid}
//           >
//             Tasdiqlash
//           </Button>
//         </div>
//       )}
//       {step === 3 && (
//         <div>
//           <h2 className="text-2xl font-semibold text-center">Yangi parol yarating</h2>
//           <Label htmlFor="newPassword" className="mt-4">Yangi parol</Label>
//           <Input
//             id="newPassword"
//             type="password"
//             value={newPassword}
//             onChange={(e) => setNewPassword(e.target.value)}
//             className="w-full mt-2"
//           />
//           <Label htmlFor="confirmPassword" className="mt-4">Parolni tasdiqlang</Label>
//           <Input
//             id="confirmPassword"
//             type="password"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             className="w-full mt-2"
//           />
//           <Button 
//             onClick={handlePasswordReset} 
//             className="w-full mt-4 bg-green-600 hover:bg-green-700"
//             disabled={!isPasswordValid}
//           >
//             Parolni yangilash
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ForgotPassword;


// "use client";

// import { useState, useEffect, useRef } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { toast } from "sonner";

// import { Mail } from "../../../public/img/auth/Mail";
// import { Lock } from "../../../public/img/auth/lock";
// import { OpenEye } from "../../../public/img/auth/openEye";
// import { Eye, EyeOff } from "lucide-react";

// const ForgotPassword = ({ setIsForgotPassword }: { setIsForgotPassword: (value: boolean) => void }) => {
//   const [step, setStep] = useState("email");
//   const [email, setEmail] = useState("");
//   const [verificationCode, setVerificationCode] = useState(new Array(6).fill(""));
//   const [generatedCode, setGeneratedCode] = useState("");
//   const [timeLeft, setTimeLeft] = useState(30);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const inputs = useRef<(HTMLInputElement | null)[]>([]);

//   useEffect(() => {
//     if (timeLeft > 0) {
//       const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
//       return () => clearTimeout(timer);
//     }
//   }, [timeLeft]);

//   const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

//   const generateFakeCode = () => {
//     const fakeCode = Math.floor(100000 + Math.random() * 900000).toString();
//     setGeneratedCode(fakeCode);
//     toast(`Tasdiqlash kodingiz: ${fakeCode}`);
//     setTimeLeft(30);
//   };

//   const handleEmailSubmit = () => {
//     if (!isValidEmail(email)) {
//       toast.error("Iltimos, to‘g‘ri email kiriting!");
//       return;
//     }
//     if (email === "fake@example.com") {
//       generateFakeCode();
//       setStep("verify");
//     } else {
//       toast.error("Bu email ro‘yxatda yo‘q.");
//     }
//   };

//   const handleCodeChange = (index: number, value: string) => {
//     if (/^\d?$/.test(value)) {
//       const newCode = [...verificationCode];
//       newCode[index] = value;
//       setVerificationCode(newCode);
//       if (value !== "" && index < 5) inputs.current[index + 1]?.focus();
//       if (value === "" && index > 0) inputs.current[index - 1]?.focus();
//     }
//   };

//   const handleCodeSubmit = () => {
//     if (verificationCode.join("") === generatedCode) {
//       setStep("reset");
//     } else {
//       toast.error("Noto‘g‘ri kod! Qayta urinib ko‘ring.");
//     }
//   };

//   const handlePasswordReset = () => {
//     if (newPassword.length < 6) {
//       toast.error("Parol kamida 6 ta belgidan iborat bo‘lishi kerak!");
//       return;
//     }
//     if (newPassword !== confirmPassword) {
//       toast.error("Parollar mos kelmadi!");
//       return;
//     }
//     toast.success("Parolingiz muvaffaqiyatli yangilandi!");
//     setIsForgotPassword(false);
//   };

//   const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
//     e.preventDefault();
//     const pasted = e.clipboardData.getData("text").slice(0, 6);
//     if (!/^\d{6}$/.test(pasted)) return;

//     setVerificationCode(pasted.split(""));
//     inputs.current[5]?.focus();
//   };

//   const isEmailValid = isValidEmail(email);
//   const isCodeValid = verificationCode.join("").length === 6;
//   const isPasswordValid = newPassword.length >= 6 && newPassword === confirmPassword;

//   return (
//     <div className="max-w-md mx-auto p-6 space-y-8">
//       {step === "email" && (
//         <div className="space-y-4">
//           <h1 className="text-2xl font-semibold text-center">Qayta tiklash</h1>
//           <p className="text-center text-muted-foreground">
//             Parolni qayta tiklash uchun tizimda ro'yhatdan o'tgan email pochtangizni kiriting!
//           </p>
//           <div className="relative">
//           <div className="absolute inset-y-0 left-3 flex items-center">
//     <Mail  />
//   </div>

//             {/* className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" */}
//             <Input
//               type="email"
//               placeholder="Email pochta"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="rounded-[16px] p-4 w-full pl-10 h-[54px] bg-[#f6f6f6]"
//             />
//           </div>
//           <Button
//             className="w-full rounded-[16px] h-[52px] flex justify-center items-center  hover:primary-bg"
//             onClick={handleEmailSubmit}
//             disabled={!isEmailValid}
//           >
//             Parolni tiklash
//           </Button>
//         </div>
//       )}

//       {step === "verify" && (
//         <div className="space-y-4">
//           <h1 className="text-2xl font-semibold text-center">Tasdiqlash</h1>
//           <p className="text-center text-muted-foreground">
//             Tasdiqlash uchun <span className="text-[#8B1D1D]">{email}</span> raqamiga yuborilgan sms kodni
//             kiriting!
//           </p>
//           <div className="grid grid-cols-6 gap-2">
//             {verificationCode.map((digit, index) => (
//               <Input
//                 key={index}
//                 id={`code-${index}`}
//                 type="text"
//                 maxLength={1}
//                 value={digit}
//                 onChange={(e) => handleCodeChange(index, e.target.value)}
//                 onPaste={handlePaste}
//                 className="w-12 h-12 text-center border rounded-xl bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none"
//               />
//             ))}
//           </div>
//           <div className="text-center text-xl font-medium">00:{timeLeft.toString().padStart(2, "0")}</div>
//           <Button
//             className="w-full rounded-[16px] h-[52px] flex justify-center items-center  hover:primary-bg"
//             onClick={handleCodeSubmit}
//             disabled={!isCodeValid}
//           >
//             Tasdiqlash
//           </Button>
//           <button className="w-full text-[#8B1D1D] underline" onClick={() => setStep("email")}>
//             Nomerni almashtirish
//           </button>
//         </div>
//       )}

//       {step === "reset" && (
//         <div className="space-y-4">
//           <h1 className="text-2xl font-semibold text-center">Qayta tiklash</h1>
//           <div className="space-y-4">
//             <div className="relative">
//               <div className="absolute inset-y-0 left-3 flex items-center">
// <Lock  />
//               </div>
              
//               <Input
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Parol o'ylab toping"
//                 value={newPassword}
//                 onChange={(e) => setNewPassword(e.target.value)}
//                 className="rounded-[16px] p-4 w-full pl-10 h-[54px] bg-[#f6f6f6]"
//               />
//               <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-0 h-full flex items-center">
//                 {showPassword ? (
//                   <EyeOff className="h-5 w-5 text-muted-foreground" />
//                 ) : (
//                   <OpenEye />
//                 )}
//               </button>
//             </div>
//             <div className="relative">
//             <div className="absolute inset-y-0 left-3 flex items-center">
// <Lock  />
//               </div>
//               <Input
//                 type={showConfirmPassword ? "text" : "password"}
//                 placeholder="Parolni takrorlang"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 className="rounded-[16px] p-4 w-full pl-10 h-[54px] bg-[#f6f6f6]"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                 className="absolute right-2 top-0 h-full flex items-center"
//               >
//                 {showConfirmPassword ? (
//                   <EyeOff className="h-5 w-5 text-muted-foreground" />
//                 ) : (
//                   <OpenEye />
//                 )}
//               </button>
//             </div>
//           </div>
//           <Button
//             className="w-full rounded-[16px] h-[52px] flex justify-center items-center  hover:primary-bg"
//             onClick={handlePasswordReset}
//             disabled={newPassword.length < 6 || newPassword !== confirmPassword}
//           >
//             Parolni tiklash
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ForgotPassword;
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
          className="w-12 h-12 text-center border rounded-xl bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none"
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
