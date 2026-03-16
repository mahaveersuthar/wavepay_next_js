"use client";

import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { ApiRoutes } from "@/Utilities/ApiRoutes";
import { callApi } from "@/Utilities/CallApi";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const code = searchParams.get("code") || "";

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const pageError = useMemo(() => {
    if (!email || !code) return "Email or OTP code is missing.";
    return "";
  }, [email, code]);

  const passwordError = useMemo(() => {
    if (!password.trim()) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return "";
  }, [password]);

  const confirmationError = useMemo(() => {
    if (!passwordConfirmation.trim()) return "Confirm password is required";
    if (passwordConfirmation !== password) return "Passwords do not match";
    return "";
  }, [password, passwordConfirmation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pageError || passwordError || confirmationError) {
      toast.error(pageError || passwordError || confirmationError);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await callApi(ApiRoutes.resetPassword, {
        method: "POST",
        data: {
          email,
          code,
          password,
          password_confirmation: passwordConfirmation,
        },
      });

      toast.success(response?.message || "Password reset successful");
      router.push("/");
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong!");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to render the eye button
  const ToggleIcon = ({ visible, setVisible }: { visible: boolean; setVisible: (v: boolean) => void }) => (
    <button
      type="button"
      onClick={() => setVisible(!visible)}
      className="flex items-center justify-center text-gray-500 hover:text-gray-700 dark:text-white dark:hover:text-gray-300 transition-colors"
    >
      {visible ? <EyeOff size={20} /> : <Eye size={20} />}
    </button>
  );

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        
        {/* Mobile Logo Only */}
        <div className="flex justify-center mb-6 lg:hidden">
          <Image
            src="/images/logo/wavepay-logo.png"
            alt="Logo"
            width={200}
            height={200}
            className="object-contain"
            priority
          />
        </div>

        <div className="mb-5 sm:mb-8 text-center">
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white">Reset Password</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Set your new password below.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-2">
            <div>
              <Label>Email</Label>
              <Input type="email" value={email} disabled />
            </div>

            <div>
              <Label>OTP Code</Label>
              <Input type="text" value={code} disabled />
            </div>

            <div className="space-y-1">
              <Label>New Password *</Label>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                error={!!passwordError && !!password}
                hint={password ? passwordError : undefined}
                endIcon={<ToggleIcon visible={showPassword} setVisible={setShowPassword} />}
              />
            </div>

            <div className="space-y-1">
              <Label>Confirm Password *</Label>
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                disabled={isSubmitting}
                error={!!confirmationError && !!passwordConfirmation}
                hint={passwordConfirmation ? confirmationError : undefined}
                endIcon={<ToggleIcon visible={showConfirmPassword} setVisible={setShowConfirmPassword} />}
              />
            </div>

            <Button type="submit" className="w-full mt-2" disabled={isSubmitting || !!pageError}>
              {isSubmitting ? "Resetting..." : "Reset Password"}
            </Button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-700 dark:text-gray-400">
          Remembered your password?{" "}
          <Link href="/" className="text-brand-500 hover:text-brand-600 font-medium">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}