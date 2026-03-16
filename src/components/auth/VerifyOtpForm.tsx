"use client";

import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { ApiRoutes } from "@/Utilities/ApiRoutes";
import { callApi } from "@/Utilities/CallApi";
import { ApiResponse } from "@/interface/Common.interface";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";

export default function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const purpose = searchParams.get("purpose") || "registration";

  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emailError = useMemo(() => {
    if (!email) return "Email is missing. Please restart forgot password flow.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Invalid email in URL.";
    return "";
  }, [email]);

  const codeError = useMemo(() => {
    if (!code.trim()) return "OTP is required";
    if (!/^\d{4}$/.test(code.trim())) return "OTP must be 4 digits";
    return "";
  }, [code]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (emailError) {
      toast.error(emailError);
      return;
    }

    if (codeError) {
      toast.error(codeError);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await callApi(ApiRoutes.verifyOTP, {
        method: "POST",
        data: {
          email,
          code: code.trim(),
          purpose,
        },
      });
      toast.success(response?.message || "OTP verified");
      router.push(
        `/reset-password?email=${encodeURIComponent(email)}&code=${encodeURIComponent(code.trim())}`,
      );
    } catch (err: any) {
     
      const errMessage = err?.message || err?.data?.message || "Something went wrong!"
      toast.error(errMessage)
    } finally {
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
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white">Verify OTP</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Enter the OTP sent to your email.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-2">
            <div>
              <Label>Email *</Label>
              <Input type="email" value={email} disabled />
            </div>

            <div>
              <Label>OTP *</Label>
              <Input
                placeholder="Enter 4-digit OTP"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                disabled={isSubmitting}
                error={!!codeError && !!code}
                hint={code ? codeError : undefined}
              />
            </div>

            <Button type="submit" className="w-full" size="sm" disabled={isSubmitting || !!emailError}>
              {isSubmitting ? "Verifying..." : "Verify OTP"}
            </Button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-700 dark:text-gray-400">
          Back to{" "}
          <Link href="/" className="text-brand-500 hover:text-brand-600">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
