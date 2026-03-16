"use client";
import React, { useEffect, useState } from "react";
import { callApi } from "@/Utilities/CallApi";
import { ApiRoutes } from "@/Utilities/ApiRoutes";
import { toast } from "react-toastify";
import DataTable, { Column } from "../tables/DataTable";
import Pagination from "../tables/Pagination";
import Badge from "../ui/badge/Badge";
import { ArrowDownLeft, ArrowUpRight, Info } from "lucide-react";

interface TransactionData {
  id: number;
  transaction_id: string;
  amount: string;
  tds: string;
  gst: string;
  service_charge: string;
  type: "debit" | "credit";
  transaction_type: string;
  opening_balance: string;
  closing_balance: string;
  remark: string;
  created_at: string;
}

export default function RecentTransactions({title}:{title:string}) {
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });

  useEffect(() => {
    fetchTransactions(pagination.currentPage);
  }, [pagination.currentPage]);

  const fetchTransactions = async (page: number) => {
    try {
      setLoading(true);
      const response = await callApi(`${ApiRoutes.transactions}?page=${page}`);
      setTransactions(response.data || []);
      setPagination({
        currentPage: response.current_page,
        totalPages: response.last_page,
      });
    } catch (err: any) {
      toast.error(err?.message || "Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  const columns: Column<TransactionData>[] = [
    {
      header: "Transaction ID & Remark",
      key: "transaction_id",
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
            item.type === "debit" ? "bg-red-50 text-red-600 dark:bg-red-500/10" : "bg-green-50 text-green-600 dark:bg-green-500/10"
          }`}>
            {item.type === "debit" ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
          </div>
          <div>
            <p className="font-medium text-gray-800 dark:text-white/90 text-theme-sm line-clamp-1">
              {item.remark || "N/A"}
            </p>
            <p className="text-[10px] font-mono text-gray-400 uppercase">{item.transaction_id}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Type",
      key: "transaction_type",
      render: (item) => (
        <div className="flex flex-col gap-1">
          <Badge size="sm" color={item.type === "debit" ? "error" : "success"}>
            {item.type}
          </Badge>
          <span className="text-[10px] text-gray-400 text-center">{item.transaction_type}</span>
        </div>
      ),
    },
    {
      header: "Taxes & Charges",
      key: "tds",
      render: (item) => (
        <div className="text-theme-xs space-y-0.5">
          <p className="text-gray-500">TDS: <span className="text-gray-800 dark:text-gray-200">₹{item.tds}</span></p>
          <p className="text-gray-500">GST: <span className="text-gray-800 dark:text-gray-200">₹{item.gst}</span></p>
          <p className="text-gray-500">Fee: <span className="text-gray-800 dark:text-gray-200">₹{item.service_charge}</span></p>
        </div>
      ),
    },
    {
      header: "Balance Audit",
      key: "opening_balance",
      render: (item) => (
        <div className="text-theme-xs border-l border-gray-100 dark:border-gray-800 pl-3">
          <p className="text-gray-400 italic">Open: ₹{item.opening_balance}</p>
          <p className="text-gray-800 dark:text-gray-200 font-medium">Close: ₹{item.closing_balance}</p>
        </div>
      ),
    },
    {
      header: "Net Amount",
      key: "amount",
      align: "right",
      render: (item) => (
        <div className="text-right">
          <p className={`font-bold text-theme-sm ${item.type === "debit" ? "text-red-600" : "text-green-600"}`}>
            {item.type === "debit" ? "-" : "+"} ₹{Number(item.amount).toLocaleString("en-IN")}
          </p>
          <p className="text-[10px] text-gray-400">
            {new Date(item.created_at).toLocaleDateString('en-GB')}
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="p-5 md:p-6 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90"> {title}</h3>
          <p className="text-sm text-gray-500">Detailed view of all credits, debits, and tax deductions.</p>
        </div>
      </div>

      <DataTable
        data={transactions}
        columns={columns}
        isLoading={loading}
        shimmerCount={8}
      />

      <div className="p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-gray-100 dark:border-gray-800">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Page {pagination.currentPage} of {pagination.totalPages}
        </p>
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={(page) => setPagination(prev => ({ ...prev, currentPage: page }))}
        />
      </div>
    </div>
  );
}