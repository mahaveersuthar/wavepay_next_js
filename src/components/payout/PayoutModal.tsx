"use client";
import React, { useState } from "react";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { Banknote, User, Building2, CreditCard, Send } from "lucide-react";

interface PayoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: any) => void;
  loading?: boolean;
}

export default function PayoutModal({ isOpen, onClose, onSubmit, loading }: PayoutModalProps) {
  const [formData, setFormData] = useState({
    beneficiary_name: "",
    account_number: "",
    ifsc_code: "",
    mobile_number: "",
    email: "",
    amount: "",
    channel_id: 1,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[900px]">
      <div className="bg-white dark:bg-gray-900 rounded-[1.5rem] overflow-hidden shadow-2xl border dark:border-gray-800">
        
        {/* Header */}
        <div className="px-8 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-500 rounded-lg text-white">
              <Send size={20} />
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-900 dark:text-white">New Payout</h4>
              <p className="text-xs text-gray-500">Transfer funds to a beneficiary instantly</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">✕</button>
        </div>

        {/* Body - 3 Column Layout */}
        <div className="p-8">
          <form id="payout-form" onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Column 1: Beneficiary Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <User size={16} className="text-brand-500" />
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Beneficiary</span>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">Full Name</Label>
                <Input name="beneficiary_name" value={formData.beneficiary_name} onChange={handleChange} placeholder="Rahul Kumar" required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">Mobile Number</Label>
                <Input name="mobile_number" value={formData.mobile_number} onChange={handleChange} placeholder="9999999999" required maxLength={10} />
              </div>
            </div>

            {/* Column 2: Bank Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Building2 size={16} className="text-brand-500" />
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Bank Account</span>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">Account Number</Label>
                <Input name="account_number" value={formData.account_number} onChange={handleChange} placeholder="1234567890" required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">IFSC Code</Label>
                <Input name="ifsc_code" value={formData.ifsc_code} onChange={handleChange} placeholder="HDFC0001234" required className="uppercase" />
              </div>
            </div>

            {/* Column 3: Transfer Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Banknote size={16} className="text-brand-500" />
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Transfer</span>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">Amount (₹)</Label>
                <Input name="amount" type="number" value={formData.amount} onChange={handleChange} placeholder="100" required className="text-lg font-bold text-brand-600" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">Email Address</Label>
                <Input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="beneficiary@example.com" required />
              </div>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-white/5 flex items-center justify-between">
          <p className="text-xs text-gray-500 italic">
            * Ensure bank details are correct. Transfers are irreversible.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="px-6 rounded-xl">
              Cancel
            </Button>
            <Button 
              form="payout-form" 
              type="submit" 
              disabled={loading} 
              className="px-10 rounded-xl bg-brand-500 text-white font-bold shadow-lg shadow-brand-500/30"
            >
              {loading ? "Processing..." : "Initiate Payout"}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}