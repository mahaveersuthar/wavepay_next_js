"use client";
import React, { useState } from "react";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { Upload, IndianRupee, CreditCard, X } from "lucide-react";
import Select from "../ui/select/select";

interface CreateFundModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
  loading: boolean;
}

export default function CreateFundModal({
  isOpen,
  onClose,
  onSubmit,
  loading,
}: CreateFundModalProps) {
  const [amount, setAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("upi");
  const [attachment, setAttachment] = useState<File | null>(null);

  const paymentOptions = [
    { label: "UPI", value: "upi" },
    { label: "Bank Transfer", value: "bank_transfer" },
    { label: "RTGS/NEFT", value: "rtgs_neft" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Convert input value to a number
    const numericAmount = parseFloat(amount);
    
    // 2. Check if it's a valid number
    if (isNaN(numericAmount)) {
      alert("Please enter a valid amount");
      return;
    }

    // 3. Format to exactly 2 decimal places (returns a string)
    const formattedAmount = numericAmount.toFixed(2);

    const data = new FormData();
    data.append("amount", formattedAmount); // Now sending "100.00" instead of 100
    data.append("payment_mode", paymentMode);
    
    if (attachment) {
      data.append("attachment", attachment);
    }
    
    onSubmit(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[850px]">
      <div className="bg-white dark:bg-gray-900 rounded-[1.5rem] overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800 transition-colors duration-200">
        
        {/* Header */}
        <div className="px-8 py-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/30 dark:bg-white/5">
          <div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white">
              Request Wallet Funding
            </h4>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-medium">
              Add balance to your account
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-white transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            
            {/* Amount Input */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                <IndianRupee size={14} className="text-brand-500"/> Amount
              </Label>
              <Input 
                type="number" 
                placeholder="1000.00" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                required 
                className="h-11 w-full dark:text-white dark:bg-gray-800 dark:border-gray-700 focus:ring-brand-500/20"
              />
            </div>

            {/* Payment Mode Select */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                <CreditCard size={14} className="text-brand-500"/> Payment Mode
              </Label>
              <Select
                options={paymentOptions}
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                placeholder="Select Mode"
                className="dark:text-white"
              />
            </div>

            {/* Custom File Upload */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                <Upload size={14} className="text-brand-500"/> Receipt
              </Label>
              <div className="relative">
                <input 
                  type="file" 
                  id="file-upload"
                  accept="image/*,.pdf"
                  onChange={(e) => setAttachment(e.target.files?.[0] || null)}
                  className="hidden"
                  required
                />
                <label 
                  htmlFor="file-upload"
                  className={`flex items-center justify-between w-full h-11 px-4 border rounded-xl cursor-pointer transition-all overflow-hidden
                    ${attachment 
                      ? "border-brand-500 bg-brand-50/50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-400" 
                      : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-white hover:border-brand-400 dark:hover:border-gray-600"
                    }`}
                >
                  <span className="text-sm truncate pr-2">
                    {attachment ? attachment.name : "Choose File"}
                  </span>
                  <Upload size={16} className={attachment ? "text-brand-500" : "text-gray-400"} />
                </label>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="mt-10 pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose} 
              className="px-6 rounded-xl border-gray-200 dark:border-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading} 
              className="bg-brand-500 hover:bg-brand-600 text-white px-10 rounded-xl shadow-lg shadow-brand-500/20 disabled:opacity-50 transition-all active:scale-95"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </span>
              ) : (
                "Submit Request"
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}