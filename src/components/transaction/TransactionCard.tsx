"use client";

import React, { useState } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Badge from "../ui/badge/Badge";
import { GridIcon } from "@/icons";
import DataTable, { Column } from "../tables/DataTable";
import Card from "../common/Card";

/* ---------- Types ---------- */
interface Transaction {
  id: string;
  customer: string;
  qrId: string;
  amount: string;
  method: string;
  date: string;
  status: "Success" | "Pending" | "Failed";
}

/* ---------- Dummy Data ---------- */
const transactions: Transaction[] = [
  {
    id: "TXN-10021",
    customer: "John Doe",
    qrId: "QR-9920",
    amount: "₹120.00",
    method: "UPI",
    date: "2024-01-18",
    status: "Success",
  },
  {
    id: "TXN-10022",
    customer: "John Doe",
    qrId: "QR-9920",
    amount: "₹120.00",
    method: "UPI",
    date: "2024-01-18",
    status: "Success",
  },
  {
    id: "TXN-10023",
    customer: "John Doe",
    qrId: "QR-9920",
    amount: "₹120.00",
    method: "UPI",
    date: "2024-01-18",
    status: "Success",
  },
  {
    id: "TXN-10024z",
    customer: "John Doe",
    qrId: "QR-9920",
    amount: "₹120.00",
    method: "UPI",
    date: "2024-01-18",
    status: "Success",
  },
];

export default function TransactionTable() {
  const { isOpen, openModal, closeModal } = useModal();

  /* ---------- Table Columns ---------- */
  const columns: Column<Transaction>[] = [
    {
      header: "Transaction ID",
      key: "id",
      render: (item) => (
        <span className="font-mono font-semibold">{item.id}</span>
      ),
    },
    { header: "Customer", key: "customer" },
    { header: "QR ID", key: "qrId" },
    {
      header: "Amount",
      key: "amount",
      render: (item) => (
        <span className="font-bold text-gray-800 dark:text-white">
          {item.amount}
        </span>
      ),
    },
    { header: "Method", key: "method" },
    { header: "Date", key: "date" },
    {
      header: "Status",
      key: "status",
      align: "right",
      render: (item) => (
        <div className="flex justify-end">
          <Badge
            size="sm"
            color={
              item.status === "Success"
                ? "success"
                : item.status === "Pending"
                ? "warning"
                : "error"
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
            <div className="w-14 h-14 rounded-xl bg-brand-50 text-brand-500 flex items-center justify-center dark:bg-brand-500/10">
              <GridIcon className="w-7 h-7" />
            </div>

            <div>
              <h4 className="text-lg font-bold text-gray-800 dark:text-white">
                Transactions
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Read-only transaction history
              </p>
            </div>
          </div>

          <Button
            className="rounded-xl bg-brand-500 text-white hover:bg-brand-600"
            onClick={openModal}
          >
            Create Transaction
          </Button>
        </div>
      </Card>

      {/* ---------- Table ---------- */}
      <Card>
        <DataTable data={transactions} columns={columns} />
      </Card>

      {/* ---------- Add Transaction Modal ---------- */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[520px] m-4">
        <div className="p-8 rounded-[2rem] bg-white dark:bg-gray-900 border dark:border-gray-800">
          <h4 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
            Add Transaction
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Enter transaction details manually
          </p>

          <form className="space-y-5">
            <div>
              <Label>Customer Name</Label>
              <Input placeholder="John Doe" />
            </div>

            <div>
              <Label>QR ID</Label>
              <Input placeholder="QR-9920" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Amount</Label>
                <Input type="number" placeholder="0.00" />
              </div>

              <div>
                <Label>Payment Method</Label>
                <select className="w-full h-11 rounded-xl border px-3 dark:border-gray-700 dark:bg-white/[0.03]">
                  <option>UPI</option>
                  <option>Card</option>
                  <option>Cash</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Date</Label>
                <Input type="date" />
              </div>

              <div>
                <Label>Status</Label>
                <select className="w-full h-11 rounded-xl border px-3 dark:border-gray-700 dark:bg-white/[0.03]">
                  <option>Success</option>
                  <option>Pending</option>
                  <option>Failed</option>
                </select>
              </div>
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
                Save Transaction
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
