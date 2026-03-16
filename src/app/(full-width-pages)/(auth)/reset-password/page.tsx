import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { Suspense } from "react";

export default function ResetPasswordPage() {
  return (
    // The Suspense boundary fixes the build error
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading form...</p>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}