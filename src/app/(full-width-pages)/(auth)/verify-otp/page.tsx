import VerifyOtpForm from "@/components/auth/VerifyOtpForm";
import { Suspense } from "react";

export default function VerifyOtpPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-gray-500">Loading form...</p>
        </div>
      }
    >
      <VerifyOtpForm />
    </Suspense>
  );
}
