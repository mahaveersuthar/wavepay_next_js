"use client";

import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { callApi } from "@/Utilities/CallApi";
import { ApiRoutes } from "@/Utilities/ApiRoutes";
import { toast } from "react-toastify";
import Cookies from "js-cookie";


export default function SignInForm() {
  const router = useRouter();
  const [formErrors, setFormErrors] = useState<{
    email?: string;
    password?: string;
  }>({});


  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false)

  const normalizeRole = (value?: string | null) => {
    if (!value) return "";
    return value.toLowerCase();
  };

  const validateForm = () => {
    const errors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Enter a valid email address";
    }

    if (!password.trim()) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const payload = {
        email,
        password,
      };

      const response = await callApi<any>(ApiRoutes.logIn, {
        method: "POST",
        data: payload,
        requireLocation: true,
      });

      if (response?.success === false) {
        toast.error(response?.message || "Login failed");
        return;
      }

      const loginData = response?.data || {};
      const accessToken =
        loginData?.access_token ||
        loginData?.accessToken ||
        loginData?.token ||
        response?.access_token ||
        response?.accessToken ||
        response?.token;

      const refreshToken =
        loginData?.refresh_token ||
        loginData?.refreshToken ||
        response?.refresh_token ||
        response?.refreshToken;

      const role =
        loginData?.role ||
        loginData?.user?.role ||
        response?.role ||
        response?.user?.role;


      if (!accessToken) {
        toast.error("Login response did not include access token");
        return;
      }

      if (accessToken) {
        Cookies.set("pinepeAccessToken", accessToken, { expires: isChecked ? 7 : 1 });
      }
      if (refreshToken) {
        Cookies.set("pinepeRefreshToken", refreshToken, { expires: isChecked ? 7 : 1 });
      }
      const normalizedRole = normalizeRole(role);

      if (normalizedRole) {
        Cookies.set("pinepeRole", normalizedRole, { expires: isChecked ? 7 : 1 });
      }


      toast.success(response?.message || "Login successful");

      router.replace("/dashboard");
    } catch (err: any) {
      console.error("Login failed:", err);
      const errMessage = err?.message || err?.data?.message || "Something went wrong!"
      toast.error(errMessage)
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setFormErrors((prev) => ({ ...prev, email: undefined }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setFormErrors((prev) => ({ ...prev, password: undefined }));
  };


  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">


        <div className="flex justify-center mb-6 lg:hidden">
          <Image
            src="/images/logo/wavepay-logo.png"
            alt="WavePay Logo"
            width={200}
            height={200}
            className="object-contain"
            priority
          />
        </div>

        <div className="mb-5 sm:mb-8 text-center">
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white">
            Sign In
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter your email and password to sign in!
          </p>
        </div>


        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <Label>Email *</Label>
              <Input
                placeholder="info@gmail.com"
                type="email"
                value={email}
                onChange={handleEmailChange}
                disabled={isLoading}
                error={!!formErrors.email}
                hint={formErrors.email}
              />

            </div>

            <div>
              <Label>Password *</Label>

              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={handlePasswordChange}
                  disabled={isLoading}
                  error={!!formErrors.password}
                  hint={formErrors.password}
                  endIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeIcon /> : <EyeCloseIcon />}
                    </button>
                  }
                />
              </div>
            </div>


            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                
               
              </div>
              <Link href="/forgot-password" className="text-sm text-brand-500">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="sm"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
