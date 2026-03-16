"use client";

import React, { useState } from "react";
import { useModal } from "../../hooks/useModal";
import Button from "../ui/button/Button";
import { Wallet, ArrowUpRight } from "lucide-react";
import Card from "../common/Card";
import RecentTransactions from "../wallet/RecentTransaction";
import { toast } from "react-toastify";
import { callApi } from "@/Utilities/CallApi";
import { ApiRoutes } from "@/Utilities/ApiRoutes";
import PayoutModal from "./PayoutModal";


export default function PayoutTable() {
  const { isOpen, openModal, closeModal } = useModal();
  const [loading, setLoading] = useState(false);

  const handlePayoutSubmit = async (payload: any) => {
    try {
      setLoading(true);
      
      // API call to create payout
      const response = await callApi(ApiRoutes.payout, {
        method: "POST",
        data: payload,
      });

      if (response?.success || response?.status === "success") {
        toast.success(response?.message || "Payout initiated successfully!");
        closeModal();
        // You might want to refresh the recent transactions here
      } else {
        toast.error(response?.message || "Failed to initiate payout");
      }
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || error.message || "Something went wrong";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-full mx-auto space-y-6">
      {/* ---------- Statistics Grid ---------- */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center dark:bg-brand-500/10">
            <Wallet size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Available Balance</p>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">₹24,500.00</h3>
          </div>
        </Card>
      </div> */}

      {/* ---------- Header ---------- */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">Payout</h1>
            <p className="text-sm text-gray-500">Manage and initiate bank transfers</p>
          </div>

          <Button
            className="w-full lg:w-auto rounded-xl bg-brand-500 text-white hover:bg-brand-600 flex items-center justify-center gap-2 shadow-sm"
            onClick={openModal}
          >
            <ArrowUpRight size={18} />
            Send Bank Payout
          </Button>
        </div>
      </Card>

      {/* ---------- History ---------- */}
      <RecentTransactions title="Transaction" />

      {/* ---------- Imported Modal ---------- */}
      <PayoutModal
        isOpen={isOpen} 
        onClose={closeModal} 
        onSubmit={handlePayoutSubmit} 
        loading={loading}
      />
    </div>
  );
}