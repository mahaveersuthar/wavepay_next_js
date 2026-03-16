"use client";
import React, { useEffect, useState } from "react";
import { UserIcon } from "@/icons";

import { ApiRoutes } from "@/Utilities/ApiRoutes";
import { toast } from "react-toastify";
import DataTable, { Column } from "../tables/DataTable";
import Pagination from "../tables/Pagination";
// 1. Import MapPin for better UI
import { MapPin } from "lucide-react";
import { callApi } from "@/Utilities/CallApi";

interface LoginHistoryItem {
  id: number;
  ip_address: string;
  user_agent: string;
  login_at: string;
  latitude: string | null;
  longitude: string | null;
}

export default function RecentLoginHistory() {
  const [historyData, setHistoryData] = useState<LoginHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });

  useEffect(() => {
    fetchHistory(pagination.currentPage);
  }, [pagination.currentPage]);

  const fetchHistory = async (page: number) => {
    try {
      setLoading(true);
      const response = await callApi(`${ApiRoutes.loginHistory}?page=${page}`);
      setHistoryData(response.data || []);
      setPagination({
        currentPage: response.current_page,
        totalPages: response.last_page,
      });
    } catch (err: any) {
      toast.error(err?.message || "Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  const formatReadableDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString.replace(" ", "T"));
    return new Intl.DateTimeFormat("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  const parseUserAgent = (ua: string) => {
    if (ua.includes("Postman")) return "Postman Runtime";
    const isWin = ua.includes("Windows");
    const isMac = ua.includes("Macintosh");
    const isChrome = ua.includes("Chrome");
    const isSafari = ua.includes("Safari") && !ua.includes("Chrome");
    const os = isWin ? "Windows" : isMac ? "macOS" : "Unknown OS";
    const browser = isChrome ? "Chrome" : isSafari ? "Safari" : "Browser";
    return `${browser} on ${os}`;
  };

  const columns: Column<LoginHistoryItem>[] = [
    {
      header: "Device & Session",
      key: "user_agent",
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <UserIcon className="text-gray-600 dark:text-gray-400 size-5" />
          </div>
          <div>
            <p className="font-medium text-gray-800 dark:text-white/90">
              {parseUserAgent(item.user_agent)}
            </p>
            <p className="text-xs text-gray-500">{item.ip_address}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Location",
      key: "location",
      render: (item) => {
        // 2. Map redirection logic
        if (item.latitude && item.longitude) {
          const mapUrl = `https://www.google.com/maps?q=${item.latitude},${item.longitude}`;
          return (
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-brand-500 hover:text-brand-600 font-medium transition-colors"
            >
              <MapPin size={14} />
              <span>View on Maps</span>
            </a>
          );
        }
        return <span className="text-gray-400 italic text-sm">Not available</span>;
      },
    },
    {
      header: "Status",
      key: "status",
      render: () => (
        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400">
          Success
        </span>
      ),
    },
    {
      header: "Login Date",
      key: "login_at",
      align: "right",
      render: (item) => (
        <span className="text-gray-500 dark:text-gray-400 text-xs font-medium">
          {formatReadableDate(item.login_at)}
        </span>
      ),
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="p-5 md:p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Recent Login History
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Monitor your account's recent activity
          </p>
        </div>
        <button className="text-sm font-medium text-brand-500 hover:text-brand-600">
          Sign out all
        </button>
      </div>

      <DataTable
        data={historyData}
        columns={columns}
        isLoading={loading}
        shimmerCount={5}
      />

      <div className="p-5 flex items-center justify-between border-t border-gray-100 dark:border-gray-800">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Showing page {pagination.currentPage} of {pagination.totalPages}
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