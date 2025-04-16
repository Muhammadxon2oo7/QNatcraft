'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { User, Lock, Mail, CheckCircle } from 'lucide-react';
import { EyeOff } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { toast } from 'sonner';
import { register as registerAction, RegisterType } from '@/services/auth/register';
import { OpenEye } from '../../../public/img/auth/openEye';
import { motion } from 'framer-motion';

export default function RegisterForm({ onSubmit }: { onSubmit: () => void }) {
  const tauth = useTranslations('auth');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const termsRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      setFormData((prev) => ({
        ...prev,
        username: parsedUserData.username || '',
        email: parsedUserData.email || '',
      }));
    }
  }, []);

  useEffect(() => {
    if (showTermsModal && termsRef.current) {
      const { scrollHeight, clientHeight } = termsRef.current;
      if (scrollHeight <= clientHeight) {
        setScrolledToBottom(true);
      } else {
        setScrolledToBottom(false);
      }
    }
  }, [showTermsModal]);

  const handleScroll = () => {
    if (termsRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = termsRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 5) {
        setScrolledToBottom(true);
      }
    }
  };

  const validateField = (name: keyof typeof formData, value: string) => {
    let error = '';
    switch (name) {
      case 'username':
        if (!value) error = tauth('register.errors.input.name.second');
        break;
      case 'email':
        if (!value) error = tauth('register.errors.input.email.first');
        else if (!/\S+@\S+\.\S+/.test(value))
          error = tauth('register.errors.input.email.second');
        break;
      case 'password':
        if (!value) error = tauth('register.errors.input.password.first');
        else if (value.length < 8)
          error = tauth('register.errors.input.password.length') || 'Parol kamida 8 belgi bo‘lishi kerak';
        else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*])/.test(value))
          error =
            tauth('register.errors.input.password.complexity') ||
            'Parolda katta harf, kichik harf, raqam va maxsus belgi bo‘lishi kerak';
        break;
      case 'confirmPassword':
        if (value !== formData.password)
          error = tauth('register.errors.input.confirmPassword.first');
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name as keyof typeof formData, value);
  };

  const isFormValid = useMemo(
    () =>
      Object.values(errors).every((error) => !error) &&
      Object.values(formData).every((field) => field) &&
      isAgreed,
    [errors, formData, isAgreed]
  );

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setShowTermsModal(true);
    } else {
      setIsAgreed(false);
    }
  };

  const handleAgree = async () => {
    if (!scrolledToBottom) {
      toast.error('Iltimos, qoidalarni oxirigacha o‘qing!');
      return;
    }
    setIsAgreed(true);
    setShowTermsModal(false);
  };

  const handleCancel = () => {
    setShowTermsModal(false);
    setIsAgreed(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      toast.error(tauth('register.fillAllFields'));
      return;
    }
    setLoading(true);
    try {
      const registerData: RegisterType = {
        first_name: formData.username,
        email: formData.email,
        password: formData.password,
      };
      const response = await registerAction(registerData);
      toast.success(tauth('register.verificationEntry'), { icon: <Mail /> });
      localStorage.setItem('userData', JSON.stringify(registerData));
      onSubmit();
    } catch (error: any) {
      toast.error(error.message || 'Ro‘yxatdan o‘tishda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({ username: '', email: '', password: '', confirmPassword: '' });
    setErrors({ username: '', email: '', password: '', confirmPassword: '' });
    setIsAgreed(false);
    setShowTermsModal(false);
    setScrolledToBottom(false);
    localStorage.removeItem('userData');
  };

  return (
    <div className="w-full max-w-md mx-auto p-6  rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        {tauth('register.title')}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username */}
        <div className="space-y-1">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <Input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="pl-10 bg-gray-50 rounded-lg h-12 border-gray-200 focus:border-red-500"
              placeholder={tauth('register.name')}
              disabled={loading}
            />
          </div>
          {errors.username && (
            <p className="text-red-500 text-xs mt-1">{errors.username}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className="pl-10 bg-gray-50 rounded-lg h-12 border-gray-200 focus:border-red-500"
              placeholder={tauth('register.email')}
              disabled={loading}
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <Input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleInputChange}
              className="pl-10 pr-10 bg-gray-50 rounded-lg h-12 border-gray-200 focus:border-red-500"
              placeholder={tauth('register.password')}
              disabled={loading}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-gray-100"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
            >
              {showPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <OpenEye />}
            </Button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="pl-10 pr-10 bg-gray-50 rounded-lg h-12 border-gray-200 focus:border-red-500"
              placeholder={tauth('register.confirmPassword')}
              disabled={loading}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-gray-100"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={loading}
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <OpenEye />}
            </Button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Terms Checkbox */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="terms"
            checked={isAgreed}
            onChange={handleCheckboxChange}
            disabled={loading}
            className="h-4 w-4 text-red-800 border-gray-300 rounded focus:ring-red-500"
          />
          <Label htmlFor="terms" className="text-gray-700 text-sm">
            <span
              className="underline cursor-pointer hover:text-red-800"
              onClick={() => setShowTermsModal(true)}
            >
              Ommaviy oferta shartlariga roziman
            </span>
          </Label>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <Button
            type="submit"
            className="w-full h-12 bg-red-800 hover:bg-red-900 text-white rounded-lg transition-colors"
            disabled={!isFormValid || loading}
          >
            {loading ? 'Yuborilmoqda...' : tauth('register.button')}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full h-12 rounded-lg border-gray-300 hover:bg-gray-100"
            onClick={handleReset}
            disabled={loading}
          >
            Tozalash
          </Button>
        </div>
      </form>

      {/* Terms Modal */}
      {showTermsModal && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-lg p-6 max-w-lg w-full h-[80vh] flex flex-col"
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <h3 className="text-lg font-bold text-gray-800 mb-4">Sayt Qoidalariga Rozilik</h3>
            <div
              ref={termsRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto text-sm text-gray-700 mb-4 border border-gray-200 p-3 rounded"
            >
              <p>
                Bu saytga ro‘yxatdan o‘tish orqali siz quyidagi shartlarga rozilik bildirasiz:
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                <br />
                <br />
                Qoidalarni oxirigacha o‘qib chiqishingizni so‘raymiz, chunki bu yerda hamma narsa adolatli va qiziqarli bo‘ladi!
                <br />
                <br />
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleAgree}
                className="w-full h-12 bg-red-800 hover:bg-red-900 text-white rounded-lg"
                disabled={!scrolledToBottom || loading}
              >
                {loading ? 'Yuborilmoqda...' : 'Roziman'}
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                className="w-full h-12 rounded-lg border-gray-300 hover:bg-gray-100"
                disabled={loading}
              >
                Bekor qilish
              </Button>
            </div>
            {!scrolledToBottom && (
              <p className="text-red-500 text-xs mt-2 text-center">
                Iltimos, qoidalarni oxirigacha o‘qing!
              </p>
            )}
          </motion.div>
        </motion.div>
      )}

      <p className="text-center text-gray-600 mt-4 text-sm">
        {tauth('register.loginRecommidation.first')}{' '}
        <Link href="/login" className="text-red-800 underline hover:text-red-900">
          {tauth('register.loginRecommidation.second')}
        </Link>
      </p>
    </div>
  );
}