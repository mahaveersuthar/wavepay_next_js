"use client";

import React, { useEffect, useState } from "react";
import { 
  IndianRupee, 
  Wallet, 
  Clock, 
  ArrowUpRight, 
  TrendingUp, 
  Percent, 
  ReceiptIndianRupee, 
  ShieldCheck 
} from "lucide-react";
import { callApi } from "@/Utilities/CallApi";
import { ApiRoutes } from "@/Utilities/ApiRoutes";
import { toast } from "react-toastify";

export const WalletMetrics = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await callApi(ApiRoutes.dashboardStats);
      setStats(response);
    } catch (err: any) {
      toast.error(err?.message || "Failed to load dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: string | number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(Number(value || 0));
  };

  if (loading) return <MetricsShimmer />;

  return (
    <div className="space-y-6">
      {/* Primary Row: Balance & Liquidity */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
        <MetricCard
          title="Wallet Balance"
          value={formatCurrency(stats?.wallet_balance)}
          icon={<Wallet className="text-blue-600 size-6" />}
          bg="bg-blue-50 dark:bg-blue-900/20"
        />
        <MetricCard
          title="Available Balance"
          value={formatCurrency(stats?.available_balance)}
          icon={<IndianRupee className="text-green-600 size-6" />}
          bg="bg-green-50 dark:bg-green-900/20"
        />
        <MetricCard
          title="Hold Balance"
          value={formatCurrency(stats?.hold_balance)}
          icon={<Clock className="text-amber-600 size-6" />}
          bg="bg-amber-50 dark:bg-amber-900/20"
        />
        <MetricCard
          title="Today's Transactions"
          value={stats?.today_transactions?.count || 0}
          subtitle={`Vol: ${formatCurrency(stats?.today_transactions?.total_amount)}`}
          icon={<ArrowUpRight className="text-purple-600 size-6" />}
          bg="bg-purple-50 dark:bg-purple-900/20"
        />
      </div>

      {/* Secondary Row: Profit, Tax & Charges */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
        <MetricCard
          title="Total Profit"
          value={formatCurrency(stats?.total_profit)}
          icon={<TrendingUp className="text-emerald-600 size-6" />}
          bg="bg-emerald-50 dark:bg-emerald-900/20"
        />
        <MetricCard
          title="Total Charges"
          value={formatCurrency(stats?.total_charges)}
          icon={<Percent className="text-red-600 size-6" />}
          bg="bg-red-50 dark:bg-red-900/20"
        />
        <MetricCard
          title="Total TDS"
          value={formatCurrency(stats?.total_tds)}
          icon={<ShieldCheck className="text-cyan-600 size-6" />}
          bg="bg-cyan-50 dark:bg-cyan-900/20"
        />
        <MetricCard
          title="Total GST"
          value={formatCurrency(stats?.total_gst)}
          icon={<ReceiptIndianRupee className="text-indigo-600 size-6" />}
          bg="bg-indigo-50 dark:bg-indigo-900/20"
        />
      </div>
    </div>
  );
};

// Reusable Card Component
const MetricCard = ({ title, value, subtitle, icon, bg }: any) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
    <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${bg}`}>
      {icon}
    </div>
    <div className="mt-5">
      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</span>
      <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
        {value}
      </h4>
      {subtitle && (
        <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{subtitle}</p>
      )}
    </div>
  </div>
);

const MetricsShimmer = () => (
  <div className="space-y-6 animate-pulse">
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-32 rounded-2xl bg-gray-100 dark:bg-gray-800" />
      ))}
    </div>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-32 rounded-2xl bg-gray-100 dark:bg-gray-800" />
      ))}
    </div>
  </div>
);