"use client";
import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import { ShieldAlert } from "lucide-react";

export default function OTPVerificationModal({ isOpen, onClose, onVerify, loading }: any) {
  const [otp, setOtp] = useState("");

  // Clear the state whenever the modal closes or opens
  useEffect(() => {
    if (!isOpen) {
      setOtp("");
    }
  }, [isOpen]);

  const handleVerify = () => {
    onVerify(otp);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[400px]">
      <div className="p-6 text-center space-y-4 bg-white dark:bg-gray-900 rounded-2xl">
        <div className="w-16 h-16 bg-orange-100 dark:bg-orange-500/10 text-orange-600 rounded-full flex items-center justify-center mx-auto">
          <ShieldAlert size={32} />
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Verify Access
        </h3>
        
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Please enter the 4-digit code sent to your registered email to perform this action.
        </p>
        
        <Input 
          type="text"
          value={otp} 
          onChange={(e) => setOtp(e.target.value)} 
          placeholder="0000" 
          className="text-center text-2xl tracking-[10px] font-bold dark:bg-gray-800 dark:text-white border-gray-200 dark:border-gray-700 focus:ring-brand-500"
          maxLength={4}
        />

        <div className="flex gap-3 pt-2">
          <Button 
            variant="outline" 
            className="flex-1 border-gray-200 dark:border-gray-700 dark:text-gray-300" 
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button 
            className="flex-1 bg-brand-500 text-white hover:bg-brand-600 transition-colors shadow-lg shadow-brand-500/20" 
            onClick={handleVerify}
            disabled={loading || otp.length < 4}
          >
            {loading ? "Verifying..." : "Confirm"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}