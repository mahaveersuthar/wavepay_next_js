"use client";

import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { ApiRoutes } from "@/Utilities/ApiRoutes";
import { callApi } from "@/Utilities/CallApi";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (value: string) => {
    if (!value.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return "Enter a valid email address";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    setIsSubmitting(true);
    try {

      const response = await callApi(ApiRoutes.forgotPassword, {
        method: "POST",
        data: { email },
      });

      if (response?.success === false) {
        const errMessage = response?.message || "Unable to send OTP";
        setError(errMessage);
        toast.error(errMessage);
        return;
      }

      toast.success(response?.message || "OTP sent to email!");
      router.push(`/verify-otp?email=${encodeURIComponent(email)}&purpose=password_reset`);

    }
    catch (err: any) {
      console.error("Login failed:", err);
      const errMessage = err?.message || err?.data?.message || "Something went wrong!"
      toast.error(errMessage)
    }
    finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="flex justify-center mb-6 lg:hidden">
          <Image
            src="/images/logo/wavepay-logo.png"
            alt="Payout API Logo"
            width={200}
            height={200}
            className="object-contain"
            priority
          />
        </div>

        <div className="mb-5 sm:mb-8 text-center">
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white">
            Forgot Password
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter your email to receive password reset instructions.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm dark:bg-green-900/20 dark:border-green-800 dark:text-green-400">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <Label>Email *</Label>
              <Input
                placeholder="info@gmail.com"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                disabled={isSubmitting}
                error={!!error}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              size="sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send OTP"}
            </Button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-700 dark:text-gray-400">
          Remembered your password?{" "}
          <Link href="/" className="text-brand-500 hover:text-brand-600">
            Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
