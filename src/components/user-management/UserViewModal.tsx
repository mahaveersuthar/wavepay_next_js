"use client";
import React from "react";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import { User, Mail, Phone, MapPin, Wallet, Calendar, ShieldCheck, Hash } from "lucide-react";

interface UserViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

export default function UserViewModal({ isOpen, onClose, user }: UserViewModalProps) {
  if (!user) return null;

  // Helper to handle empty values
  const formatValue = (val: any) => {
    if (val === null || val === undefined || val === "") return "--";
    return val;
  };

  // Helper to render compact info blocks
  const InfoBlock = ({ icon: Icon, label, value, className = "" }: any) => (
    <div className="flex flex-col gap-1 p-3 rounded-xl border border-gray-50 dark:border-white/5 bg-gray-50/50 dark:bg-white/5">
      <div className="flex items-center gap-2 text-gray-400">
        <Icon size={14} />
        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{label}</p>
      </div>
      <p className={`text-sm font-semibold text-gray-900 dark:text-white truncate ${className}`}>
        {formatValue(value)}
      </p>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[850px]"> {/* Increased width */}
      <div className="bg-white dark:bg-gray-900 rounded-[1.5rem] overflow-hidden shadow-2xl border dark:border-gray-800">
        
        {/* Header Section */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-white/5">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-500">
              <User size={24} />
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                {formatValue(user.first_name)} {formatValue(user.last_name)}
              </h4>
              <p className="text-xs text-gray-500">Username: @{formatValue(user.username)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400 uppercase">
                {formatValue(user.status)}
             </span>
             <Button variant="outline" className="h-9 w-9 p-0 rounded-lg" onClick={onClose}>✕</Button>
          </div>
        </div>

        {/* Main Grid Content - 3 Column Layout for less height */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Column 1: Primary Info */}
            <div className="space-y-3">
              <h5 className="text-[11px] font-black text-gray-400 uppercase mb-2">Account Info</h5>
              <InfoBlock icon={Mail} label="Email Address" value={user.email} />
              <InfoBlock icon={Phone} label="Phone" value={user.phone} />
              <InfoBlock icon={ShieldCheck} label="Role" value={user.role} className="capitalize text-brand-500" />
            </div>

            {/* Column 2: Location Details */}
            <div className="space-y-3">
              <h5 className="text-[11px] font-black text-gray-400 uppercase mb-2">Location</h5>
              <InfoBlock icon={MapPin} label="Address" value={user.address} />
              <div className="grid grid-cols-2 gap-3">
                <InfoBlock icon={Hash} label="City" value={user.city} />
                <InfoBlock icon={Hash} label="Zip" value={user.zip} />
              </div>
              <InfoBlock icon={Hash} label="State / Country" value={`${user.state || ""} ${user.country ? `/ ${user.country}` : ""}`} />
            </div>

            {/* Column 3: Financials & Dates */}
            <div className="space-y-3">
              <h5 className="text-[11px] font-black text-gray-400 uppercase mb-2">Finances & Timeline</h5>
              <div className="flex items-center justify-between p-3 rounded-xl bg-brand-500 text-white shadow-lg shadow-brand-500/20">
                <div>
                  <p className="text-[10px] font-bold uppercase opacity-80">Wallet Balance</p>
                  <p className="text-lg font-bold">₹{formatValue(user.wallet_balance)}</p>
                </div>
                <Wallet size={24} className="opacity-40" />
              </div>
              <InfoBlock icon={ShieldCheck} label="Hold Balance" value={`₹${user.hold_balance}`} className="text-orange-600 dark:text-orange-400" />
              <InfoBlock icon={Calendar} label="Created At" value={user.created_at ? new Date(user.created_at).toLocaleDateString() : ""} />
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-gray-50 dark:bg-white/5 border-t dark:border-gray-800 flex justify-end">
           <Button onClick={onClose} className="h-10 px-6 rounded-xl text-sm font-semibold">
             Done
           </Button>
        </div>
      </div>
    </Modal>
  );
}