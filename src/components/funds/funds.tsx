"use client";
import React, { useEffect, useState } from "react";
import DataTable, { Column, Action } from "../tables/DataTable";
import Card from "../common/Card";
import Button from "../ui/button/Button";
import Badge from "../ui/badge/Badge";
import { Plus, Eye, RefreshCcw, CheckCircle, XCircle } from "lucide-react";
import { callApi } from "@/Utilities/CallApi";
import { ApiRoutes } from "@/Utilities/ApiRoutes";
import { toast } from "react-toastify";
import CreateFundModal from "./CreateFundModal";
import Cookies from "js-cookie"; // Import Cookies helper

export default function FundManagement() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Get the role from cookies
  const userRole = Cookies.get("pinepeRole");
  const isAdmin = userRole === "admin";

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await callApi(ApiRoutes.fundRequests);
      setRequests(res?.data?.data || []);
    } catch (err) {
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: number | string, status: "approved" | "rejected") => {
    const remark = status === "approved" ? "Payment verified" : "Invalid payment proof";
    try {
      setLoading(true);
      const endpoint = `admin/fund/update-status/${id}`;
      const res = await callApi(endpoint, {
        method: "POST",
        data: { status, remark },
      });
      toast.success(res?.message || `Request ${status} successfully`);
      fetchRequests();
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRequest = async (formData: FormData) => {
    try {
      setModalLoading(true);
      const res = await callApi(ApiRoutes.fundRequestCreate, {
        method: "POST",
        data: formData,
      });
      toast.success(res.message || "Fund request created successfully");
      setIsModalOpen(false);
      fetchRequests();
    } catch (err: any) {
      toast.error(err.message || "Submission failed");
    } finally {
      setModalLoading(false);
    }
  };

  // Define Table Actions
  const tableActions: Action<any>[] = [
    {
      label: "Approve",
      icon: <CheckCircle size={16} />,
      className: "text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20",
      // FIXED: Visible only if Role is admin AND status is pending
      show: (item) => isAdmin && item.status === "pending", 
      onClick: (item) => handleUpdateStatus(item.id, "approved"),
    },
    {
      label: "Reject",
      icon: <XCircle size={16} />,
      className: "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20",
      // FIXED: Visible only if Role is admin AND status is pending
      show: (item) => isAdmin && item.status === "pending",
      onClick: (item) => handleUpdateStatus(item.id, "rejected"),
    },
  ];

  const columns: Column<any>[] = [
   
    {
      header: "User Details",
      key: "user",
      render: (item) => (
        <div className="flex flex-col">
          <span className="font-bold text-gray-800 dark:text-white leading-tight">
            {item.user?.first_name} {item.user?.last_name}
          </span>
          <span className="text-[10px] text-gray-500">{item.user?.email}</span>
        </div>
      ),
    },
    {
      header: "Amount",
      key: "amount",
      render: (item) => <span className="font-bold text-brand-600">₹{item.amount}</span>,
    },
    {
      header: "Mode",
      key: "payment_mode",
      render: (item) => <Badge color="light">{item.payment_mode}</Badge>,
    },
    {
      header: "Status",
      key: "status",
      render: (item) => (
        <Badge
          color={
            item.status === "pending" ? "warning" : item.status === "approved" ? "success" : "error"
          }
        >
          {item.status}
        </Badge>
      ),
    },
    {
      header: "Requested On",
      key: "created_at",
      render: (item) => (
        <div className="text-xs text-gray-600 dark:text-gray-400">
          {new Date(item.created_at).toLocaleDateString("en-IN", {
            day: "2-digit", month: "short", year: "numeric",
          })}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="p-6 border-none shadow-sm bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h4 className="text-2xl font-extrabold text-gray-900 dark:text-white">Fund Request</h4>
            <p className="text-sm text-gray-500">Approve or Reject wallet top-up requests</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={fetchRequests} className="p-2.5 rounded-xl border-gray-200">
              <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
            </Button>
            {/* Optionally hide 'New Request' button for admins if they don't request funds */}
            {!isAdmin && (
              <Button onClick={() => setIsModalOpen(true)} className="bg-brand-500 hover:bg-brand-600 text-white flex items-center gap-2 px-6 py-2.5 rounded-xl shadow-lg">
                <Plus size={18} /> New Request
              </Button>
            )}
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden border-none shadow-sm">
        <DataTable data={requests} columns={columns} isLoading={loading} actions={isAdmin ? tableActions : undefined} />
      </Card>

      <CreateFundModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleCreateRequest} loading={modalLoading} />
    </div>
  );
}