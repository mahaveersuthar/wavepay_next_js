"use client";

import React from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Badge from "../ui/badge/Badge";
import { GridIcon, Eye, Download, Trash2, Send } from "lucide-react"; // Using Lucide for consistent icons
import DataTable, { Column, Action } from "../tables/DataTable";
import Card from "../common/Card";

/* ---------- Types ---------- */
interface BulkPayout {
  id: string;
  batchName: string;
  recipients: number;
  totalAmount: string;
  executionDate: string;
  status: "Completed" | "Processing" | "Scheduled" | "Failed";
}

/* ---------- Dummy Data ---------- */
const bulkPayouts: BulkPayout[] = [
  {
    id: "BP-5001",
    batchName: "Jan Monthly Salaries",
    recipients: 124,
    totalAmount: "₹45,200.00",
    executionDate: "2024-01-28",
    status: "Completed",
  },
  {
    id: "BP-5002",
    batchName: "Affiliate Commissions",
    recipients: 45,
    totalAmount: "₹12,450.00",
    executionDate: "2024-02-01",
    status: "Processing",
  },
  {
    id: "BP-5003",
    batchName: "Vendor Clearances",
    recipients: 12,
    totalAmount: "₹8,900.00",
    executionDate: "2024-02-15",
    status: "Scheduled",
  },
];

export default function BulkPayoutTable() {
  const { isOpen, openModal, closeModal } = useModal();

  /* ---------- Row Actions ---------- */
  const tableActions: Action<BulkPayout>[] = [
    {
      label: "View Details",
      icon: <Eye size={16} />,
      onClick: (item) => console.log("Viewing batch:", item.id),
    },
    {
      label: "Download Report",
      icon: <Download size={16} />,
      onClick: (item) => console.log("Downloading batch:", item.id),
    },
    {
      label: "Cancel Payout",
      icon: <Trash2 size={16} />,
      className: "text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20",
      onClick: (item) => alert(`Deleting ${item.batchName}`),
    },
  ];

  /* ---------- Table Columns ---------- */
  const columns: Column<BulkPayout>[] = [
    {
      header: "Batch Name",
      key: "batchName",
      render: (item) => (
        <div className="flex flex-col">
          <span className="font-bold text-gray-800 dark:text-white">{item.batchName}</span>
          <span className="text-xs text-gray-500 font-mono">{item.id}</span>
        </div>
      ),
    },
    { 
        header: "Recipients", 
        key: "recipients",
        render: (item) => <span className="font-medium">{item.recipients} Users</span>
    },
    {
      header: "Total Amount",
      key: "totalAmount",
      render: (item) => (
        <span className="font-bold text-gray-900 dark:text-white">
          {item.totalAmount}
        </span>
      ),
    },
    { header: "Execution Date", key: "executionDate" },
    {
      header: "Status",
      key: "status",
      align: "right",
      render: (item) => (
        <div className="flex justify-end">
          <Badge
            size="sm"
            color={
              item.status === "Completed" ? "success" : 
              item.status === "Processing" ? "warning" : 
              item.status === "Scheduled" ? "light" : "error"
            }
          >
            {item.status}
          </Badge>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-full mx-auto space-y-6">
      {/* ---------- Header ---------- */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center dark:bg-blue-500/10">
              <Send className="w-7 h-7" />
            </div>

            <div>
              <h4 className="text-lg font-bold text-gray-800 dark:text-white">
                Bulk Payouts
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Manage and monitor large scale disbursement batches
              </p>
            </div>
          </div>

          <Button
            className="rounded-xl bg-brand-500 text-white hover:bg-brand-600 flex items-center gap-2"
            onClick={openModal}
          >
            Create Bulk Payout
          </Button>
        </div>
      </Card>

      {/* ---------- Table ---------- */}
      <Card>
        <DataTable 
          data={bulkPayouts} 
          columns={columns} 
          actions={tableActions}
        />
      </Card>

      {/* ---------- Create Payout Modal ---------- */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[550px] m-4">
        <div className="p-8 rounded-[2rem] bg-white dark:bg-gray-900 border dark:border-gray-800">
          <h4 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
            New Bulk Payout
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Upload a CSV or manually configure the payout batch.
          </p>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            

            <div className="p-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Drag and drop your recipient CSV here or <span className="text-brand-500 font-semibold cursor-pointer">browse</span>
                </p>
            </div>

           

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                className="w-full rounded-xl"
                onClick={closeModal}
              >
                Cancel
              </Button>

              <Button
                className="w-full rounded-xl bg-brand-500 text-white hover:bg-brand-600"
                onClick={closeModal}
              >
                Execute Batch
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
