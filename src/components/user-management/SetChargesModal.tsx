"use client";
import React, { useState, useEffect } from "react";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { Plus, Trash2 } from "lucide-react";
import Select from "../ui/select/select";

interface SetChargesModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
  initialData?: any[];
  onSubmit: (payload: any) => void;
  loading?: boolean;
}

export default function SetChargesModal({
  isOpen,
  onClose,
  userId,
  initialData,
  onSubmit,
  loading,
}: SetChargesModalProps) {
  const defaultRow = {
    service: "payout",
    min_amount: 0,
    max_amount: 1000,
    service_charge: 10,
    service_charge_type: "flat",
    tds: 5,
    tds_type: "percentage",
    gst: 18,
    transaction_type: "debit",
  };

  const [charges, setCharges] = useState([defaultRow]);

  useEffect(() => {
    if (isOpen) {
      if (initialData && initialData.length > 0) {
        // 1. Map the data
        const formatted = initialData.map((item) => ({
          service: item.service || "payout",
          min_amount: Number(item.min_amount) || 0,
          max_amount: Number(item.max_amount) || 0,
          service_charge: Number(item.service_charge) || 0,
          service_charge_type: item.service_charge_type || "flat",
          tds: Number(item.tds) || 0,
          tds_type: item.tds_type || "percentage",
          gst: Number(item.gst) || 0,
          transaction_type: item.transaction_type || "debit",
        }));

        // 2. Deduplicate based on unique slab properties
        const uniqueSlabs = formatted.filter((value, index, self) =>
          index === self.findIndex((t) => (
            t.min_amount === value.min_amount &&
            t.max_amount === value.max_amount &&
            t.transaction_type === value.transaction_type
          ))
        );

        setCharges(uniqueSlabs);
      } else {
        setCharges([defaultRow]);
      }
    }
  }, [isOpen, initialData]);
  const addRow = () => {
    const lastRow = charges[charges.length - 1];
    setCharges([
      ...charges,
      {
        ...lastRow,
        min_amount: lastRow.max_amount,
        max_amount: lastRow.max_amount + 1000,
      },
    ]);
  };

  const removeRow = (index: number) => {
    setCharges(charges.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, field: string, value: any) => {
    const updated = [...charges];
    updated[index] = { ...updated[index], [field]: value };
    setCharges(updated);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ charges });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[850px]">
      <div className="bg-white dark:bg-gray-900 rounded-[1.5rem] overflow-hidden border dark:border-gray-800 shadow-xl">

        {/* Header: Flex wrap prevents button overlap on mobile */}
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex flex-wrap justify-between items-center gap-4">
          <h4 className="text-lg font-bold text-gray-900 dark:text-white">
            Set Service Charges
          </h4>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addRow}
            className="rounded-lg h-9 mr-16 text-xs flex items-center gap-2 border-brand-200 text-brand-600 dark:text-brand-400 hover:bg-brand-50"
          >
            <Plus size={14} /> Add Range Slab
          </Button>
        </div>

        <div className="px-6 py-6 max-h-[60vh] overflow-y-auto">
          <form id="charges-form" className="space-y-6" onSubmit={handleFormSubmit}>
            {charges.map((row, index) => (
              <div
                key={index}
                className="relative p-5 bg-gray-50/50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-gray-800"
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 text-[10px] font-bold uppercase tracking-wider">
                    Range Slab #{index + 1}
                  </span>
                  {charges.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRow(index)}
                      className="group flex items-center gap-1.5 text-red-500 hover:text-red-600 transition-colors"
                    >
                      <span className="text-[11px] font-medium opacity-0 group-hover:opacity-100 transition-opacity">Remove Slab</span>
                      <div className="p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-500/10">
                        <Trash2 size={16} />
                      </div>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-x-4">
                  <div className="space-y-1.5">
                    <Label className="text-[11px] text-gray-500 dark:text-gray-400">Min Amount</Label>
                    <Input
                      type="number"
                      className="h-10 text-sm"
                      value={row.min_amount}
                      onChange={(e) => handleChange(index, "min_amount", Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[11px] text-gray-500 dark:text-gray-400">Max Amount</Label>
                    <Input
                      type="number"
                      className="h-10 text-sm"
                      value={row.max_amount}
                      onChange={(e) => handleChange(index, "max_amount", Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[11px] text-gray-500 dark:text-gray-400">Service Charge</Label>
                    <Input
                      type="number"
                      className="h-10 text-sm"
                      value={row.service_charge}
                      onChange={(e) => handleChange(index, "service_charge", Number(e.target.value))}
                    />
                  </div>
                  <div className="-mt-0.5">
                    <Select
                      label="Charge Type"
                      value={row.service_charge_type}
                      onChange={(e) => handleChange(index, "service_charge_type", e.target.value)}
                      options={[
                        { label: "Flat", value: "flat" },
                        { label: "Percentage", value: "percentage" }
                      ]}
                      className="h-[42px] text-sm !rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 mt-2 pt-4 border-t border-dashed border-gray-200 dark:border-gray-700">
                  <div className="space-y-1.5">
                    <Label className="text-[11px] text-gray-500 dark:text-gray-400">TDS (%)</Label>
                    <Input
                      type="number"
                      className="h-10 text-sm"
                      value={row.tds}
                      onChange={(e) => handleChange(index, "tds", Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[11px] text-gray-500 dark:text-gray-400">GST (%)</Label>
                    <Input
                      type="number"
                      className="h-10 text-sm"
                      value={row.gst}
                      onChange={(e) => handleChange(index, "gst", Number(e.target.value))}
                    />
                  </div>
                  <div className="-mt-0.5">
                    <Select
                      label="Transaction Type"
                      value={row.transaction_type}
                      onChange={(e) => handleChange(index, "transaction_type", e.target.value)}
                      options={[
                        { label: "Debit", value: "debit" },
                        // { label: "Credit", value: "credit" }
                      ]}
                      className="h-[42px] text-sm !rounded-lg"
                    />
                  </div>
                </div>
              </div>
            ))}
          </form>
        </div>

        <div className="p-5 px-6 border-t border-gray-100 dark:border-gray-800 flex gap-3 bg-gray-50/30 dark:bg-transparent">
          <Button variant="outline" className="flex-1 rounded-xl h-11 text-sm font-medium" onClick={onClose}>
            Discard
          </Button>
          <Button form="charges-form" type="submit" disabled={loading} className="flex-[1.5] rounded-xl bg-brand-500 text-white h-11 text-sm font-semibold shadow-lg shadow-brand-500/20">
            {loading ? "Saving Changes..." : "Apply Charges"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}