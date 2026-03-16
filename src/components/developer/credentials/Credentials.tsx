"use client";
import React, { useEffect, useState } from "react";
import {
    Copy, Eye, EyeOff, ShieldCheck, Globe, Calendar,
    Key, RefreshCw, Plus
} from "lucide-react";
import { toast } from "react-toastify";
import DataTable, { Action, Column } from "@/components/tables/DataTable";
import Card from "@/components/common/Card";
import Button from "@/components/ui/button/Button";
import { callApi } from "@/Utilities/CallApi";
import { ApiRoutes } from "@/Utilities/ApiRoutes";
import GenerateCredentialsModal from "./GenerateCredentialsModal";
import OTPVerificationModal from "./OtpVerificationModal";
import { useProfile } from "@/context/ProfileContext";

/* ---------- Types ---------- */
interface ApiCredential {
    id: number;
    user_id: number;
    client_id: string;
    client_secret: string;
    allowed_ips: string[];
    callback_url: string;
    status: number;
    created_at: string;
    updated_at: string;
}

export default function CredentialsPage() {
    const { profile } = useProfile();
    const [credentials, setCredentials] = useState<ApiCredential[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // --- Security & OTP State ---
    const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
    const [showSecretId, setShowSecretId] = useState<number | null>(null);
    const [pendingAction, setPendingAction] = useState<"reveal" | "regenerate" | null>(null);
    const [targetId, setTargetId] = useState<number | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await callApi(ApiRoutes.apiCredentailsDetail);
            const rawData = response?.data;
            if (rawData) {
                setCredentials(Array.isArray(rawData) ? rawData : [rawData]);
            } else {
                setCredentials([]);
            }
        } catch (err: any) {
            toast.error(err?.message || "Failed to load credentials");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toast.success(`${label} copied to clipboard`);
    };

    const handleGenerate = async (payload: { allowed_ips: string[]; callback_url: string }) => {
        setLoading(true);
        try {
            await callApi(ApiRoutes.generateCredentials, {
                method: 'POST',
                data: payload
            });
            toast.success("Credentials generated successfully!");
            setIsModalOpen(false);
            fetchData(); 
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to generate keys");
        } finally {
            setLoading(false);
        }
    };

    // --- Step 1: Initiate Security Action (Trigger OTP) ---
    const initiateSecureAction = async (id: number, action: "reveal" | "regenerate") => {
        // Optimization: If user wants to hide the secret they already saw, just close it
        if (action === "reveal" && showSecretId === id) {
            setShowSecretId(null);
            return;
        }

        try {
            setLoading(true)
            const response = await callApi(ApiRoutes.credentailsReadOtp, { method: "POST" });
            toast.success(response?.message || "OTP sent to registered mail!");
            
            setTargetId(id);
            setPendingAction(action);
            setIsOtpModalOpen(true);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to send OTP");
        }
        finally{
            setLoading(false)
        }
    };

    // --- Step 2: Verify OTP and Execute Pending Action ---
    const handleVerifyOtp = async (otp: string) => {
        setLoading(true);
        try {
            const userEmail = profile?.email?.trim() || "";
            if (!userEmail) {
                toast.error("Profile not loaded. Please try again.");
                return;
            }

            // Verify the OTP
            await callApi(ApiRoutes.verifyOTP, {
                method: "POST",
                data: {
                    email: userEmail,
                    code: otp.trim(),
                    purpose: "credentials_update",
                },
            });

            // Action routing based on what the user clicked
            if (pendingAction === "reveal") {
                setShowSecretId(targetId);
                toast.success("Secret revealed");
            } else if (pendingAction === "regenerate") {
                await executeRegeneration();
            }

            setIsOtpModalOpen(false);
            setPendingAction(null);
        } catch (error: any) {
            toast.error("Invalid OTP code");
        } finally {
            setLoading(false);
        }
    };

    // --- Step 3: Specific Logic for Regeneration ---
    const executeRegeneration = async () => {
        try {
            const response = await callApi(ApiRoutes.regenerateKey, { method: "POST" });
            if (response?.status) {
                toast.success(response?.message || "Secret rotated successfully!");
                setShowSecretId(null); // Hide the old revealed secret
                fetchData();
            } else {
                toast.error(response?.message || "Something went wrong!");
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to rotate secret");
        }
    };

    /* ---------- Table Columns ---------- */
    const columns: Column<ApiCredential>[] = [
        {
            header: "Client Credentials",
            key: "client_id",
            render: (item) => (
                <div className="space-y-2 py-1">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight w-12">Client ID</span>
                        <code className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-brand-500 font-mono text-xs">
                            {item.client_id}
                        </code>
                        <button onClick={() => copyToClipboard(item.client_id, "Client ID")} className="text-gray-400 hover:text-brand-500 transition-colors">
                            <Copy size={14} />
                        </button>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight w-12">Secret</span>
                        <code className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded max-w-[180px] truncate font-mono text-xs text-gray-600 dark:text-gray-400">
                            {showSecretId === item.id ? item.client_secret : "••••••••••••••••••••••••"}
                        </code>
                        <button
                            className="text-gray-400 hover:text-brand-600 transition-colors"
                            onClick={() => initiateSecureAction(item.id, "reveal")}
                        >
                            {showSecretId === item.id ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                        {showSecretId === item.id && (
                            <button
                                onClick={() => copyToClipboard(item.client_secret, "Client Secret")}
                                className="text-gray-400 hover:text-brand-500 transition-colors animate-in fade-in zoom-in duration-200"
                            >
                                <Copy size={14} />
                            </button>
                        )}
                    </div>
                </div>
            )
        },
        {
            header: "Security & Callback",
            key: "allowed_ips",
            render: (item) => (
                <div className="space-y-2">
                    <div className="flex flex-wrap gap-1">
                        {item.allowed_ips?.map(ip => (
                            <span key={ip} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-medium border border-blue-100 dark:border-blue-500/20">
                                <ShieldCheck size={10} /> {ip}
                            </span>
                        ))}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Globe size={12} className="shrink-0" />
                        <span className="truncate max-w-[150px] italic">{item.callback_url}</span>
                    </div>
                </div>
            )
        },
        {
            header: "Timestamp",
            key: "created_at",
            render: (item) => (
                <div className="flex flex-col text-xs" suppressHydrationWarning>
                    <span className="text-gray-800 dark:text-gray-200 font-medium flex items-center gap-1">
                        <Calendar size={12} /> {new Date(item.created_at).toLocaleDateString()}
                    </span>
                    <span className="text-gray-400">Last updated: {new Date(item.updated_at).toLocaleDateString()}</span>
                </div>
            )
        }
    ];

    const tableActions: Action<ApiCredential>[] = [
        {
            label: "Regenerate Secret",
            icon: <RefreshCw size={16} />,
            className: "text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/20 font-medium",
            onClick: (item) => initiateSecureAction(item.id, "regenerate"),
        }
    ];

    return (
        <div className="max-w-full mx-auto space-y-6 p-6">
            <Card className="p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-brand-50 rounded-xl text-brand-600 dark:bg-brand-500/10"><Key size={24} /></div>
                        <div>
                            <h4 className="text-lg font-bold text-gray-800 dark:text-white">API Credentials</h4>
                            <p className="text-sm text-gray-500">Security verification required for sensitive actions.</p>
                        </div>
                    </div>
                    <Button className="rounded-xl bg-brand-500 text-white flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
                        <Plus size={18} /> Generate New Credentials
                    </Button>
                </div>
            </Card>

            <Card className="overflow-hidden">
                <DataTable data={credentials} columns={columns} isLoading={loading} actions={tableActions} />
            </Card>

            <GenerateCredentialsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleGenerate}
                loading={loading}
            />

            <OTPVerificationModal
                isOpen={isOtpModalOpen}
                onClose={() => {
                    setIsOtpModalOpen(false);
                    setPendingAction(null);
                }}
                onVerify={handleVerifyOtp}
                loading={loading}
            />
        </div>
    );
}