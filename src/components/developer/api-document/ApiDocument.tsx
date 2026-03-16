"use client";
import React, { useEffect, useState } from "react";
import { callApi } from "@/Utilities/CallApi";
import Card from "@/components/common/Card";
import { toast } from "react-toastify";
import { 
    Globe, 
    Lock, 
    Terminal, 
    Layers, 
    CheckCircle2, 
    Copy,
    Info,
    Hash,
    AlertCircle,
    ChevronRight
} from "lucide-react";

/* ---------- Types ---------- */
interface Parameter {
    name: string;
    type: string;
    required: boolean;
    description: string;
}

interface ApiEndpoint {
    name: string;
    endpoint: string;
    method: string;
    headers: Record<string, string>;
    parameters: Parameter[];
    request_example: { curl: string };
    response_example: {
        success: any;
        error: any;
    };
}

interface ApiDocData {
    instructions: {
        base_url: string;
        authentication: string;
        content_type: string;
        note: string;
    };
    apis: ApiEndpoint[];
}

export default function ApiDocumentation() {
    const [docs, setDocs] = useState<ApiDocData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDocs = async () => {
            try {
                const response = await callApi('api-credentials/api-document');
                
                // DATA NORMALIZATION: 
                // Handles both { data: { instructions... } } and { instructions... }
                const finalData = response?.data?.instructions ? response.data : response;
                
                if (finalData?.instructions) {
                    setDocs(finalData);
                } else {
                    console.error("Unexpected API Structure:", response);
                }
            } catch (err: any) {
                toast.error(err?.message || "Failed to load documentation");
            } finally {
                setLoading(false);
            }
        };
        fetchDocs();
    }, []);

    const handleCopy = (text: string, label: string) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        toast.success(`${label} copied to clipboard!`);
    };

    if (loading) return <DocShimmer />;

    // If data failed to load or is empty
    if (!docs || !docs.instructions) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6">
                <AlertCircle size={48} className="text-red-500 mb-4" />
                <h2 className="text-xl font-bold">Documentation Unavailable</h2>
                <p className="text-gray-500 max-w-sm">We couldn't load the API reference. Please check your connection or contact support.</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            {/* --- Hero Section --- */}
            <header className="space-y-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-brand-500 rounded-2xl shadow-lg shadow-brand-500/20 text-white">
                        <Terminal size={32} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white">API Reference</h1>
                        <p className="text-gray-500 dark:text-gray-400">Integrate our services into your application with ease.</p>
                    </div>
                </div>
                
                {/* --- Quick Setup Cards --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="p-5 relative overflow-hidden group border-none bg-blue-50/50 dark:bg-blue-500/5">
                        <Globe className="absolute -right-2 -bottom-2 w-16 h-16 text-blue-500/10" />
                        <h3 className="text-blue-600 dark:text-blue-400 font-bold text-[10px] uppercase tracking-widest mb-2">Base URL</h3>
                        <div className="flex items-center justify-between gap-2 relative z-10">
                            <code className="text-sm font-mono font-bold text-blue-900 dark:text-blue-200 truncate">
                                {docs.instructions.base_url}
                            </code>
                            <button onClick={() => handleCopy(docs.instructions.base_url, 'URL')} className="text-blue-400 hover:text-blue-600"><Copy size={14}/></button>
                        </div>
                    </Card>

                    <Card className="p-5 relative overflow-hidden group border-none bg-orange-50/50 dark:bg-orange-500/5">
                        <Lock className="absolute -right-2 -bottom-2 w-16 h-16 text-orange-500/10" />
                        <h3 className="text-orange-600 dark:text-orange-400 font-bold text-[10px] uppercase tracking-widest mb-2">Authentication</h3>
                        <p className="text-xs font-medium text-orange-900 dark:text-orange-200 relative z-10 leading-relaxed">
                            {docs.instructions.authentication}
                        </p>
                    </Card>

                    <Card className="p-5 relative overflow-hidden group border-none bg-emerald-50/50 dark:bg-emerald-500/5">
                        <Layers className="absolute -right-2 -bottom-2 w-16 h-16 text-emerald-500/10" />
                        <h3 className="text-emerald-600 dark:text-emerald-400 font-bold text-[10px] uppercase tracking-widest mb-2">Content-Type</h3>
                        <code className="text-sm font-mono font-bold text-emerald-900 dark:text-emerald-200 relative z-10 block">
                            {docs.instructions.content_type}
                        </code>
                    </Card>
                </div>

                {docs.instructions.note && (
                    <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-500/5 rounded-xl border border-amber-100 dark:border-amber-500/20">
                        <Info className="text-amber-600 shrink-0" size={20} />
                        <p className="text-sm text-amber-800 dark:text-amber-200 italic">{docs.instructions.note}</p>
                    </div>
                )}
            </header>

            {/* --- API Endpoints --- */}
            <div className="space-y-20">
                {docs.apis?.map((api, idx) => (
                    <section key={idx} className="group scroll-mt-24">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold text-sm shadow-xl">
                                {idx + 1}
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-brand-500 transition-colors">
                                {api.name}
                            </h2>
                            <div className="h-px flex-1 bg-gradient-to-r from-gray-200 dark:from-gray-700 to-transparent" />
                        </div>

                        <div className="grid lg:grid-cols-2 gap-10">
                            {/* Definition Side */}
                            <div className="space-y-8">
                                <div className="flex flex-wrap items-center gap-3">
                                    <span className={`px-4 py-1.5 rounded-lg text-xs font-black shadow-sm text-white ${
                                        api.method === 'GET' ? 'bg-blue-500' : 'bg-emerald-500'
                                    }`}>
                                        {api.method}
                                    </span>
                                    <code className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg border dark:border-gray-700 text-gray-700 dark:text-gray-300">
                                        {api.endpoint}
                                    </code>
                                </div>

                                {/* Parameters Table */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-gray-400 font-bold text-[10px] uppercase tracking-widest">
                                        <Hash size={14} /> Request Parameters
                                    </div>
                                    <div className="overflow-hidden rounded-2xl border dark:border-gray-800 shadow-sm bg-white dark:bg-gray-900/50">
                                        <table className="w-full text-left text-sm border-collapse">
                                            <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 border-b dark:border-gray-800">
                                                <tr>
                                                    <th className="px-6 py-4 font-semibold">Field</th>
                                                    <th className="px-6 py-4 font-semibold">Type</th>
                                                    <th className="px-6 py-4 font-semibold">Required</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y dark:divide-gray-800">
                                                {api.parameters?.map((param, pIdx) => (
                                                    <tr key={pIdx} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <div className="font-mono font-bold text-brand-500">{param.name}</div>
                                                            <div className="text-[11px] text-gray-400 mt-0.5">{param.description}</div>
                                                        </td>
                                                        <td className="px-6 py-4 font-mono text-xs text-gray-500">{param.type}</td>
                                                        <td className="px-6 py-4">
                                                            {param.required ? 
                                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-600 dark:bg-red-500/10">YES</span> : 
                                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-500 dark:bg-gray-800">NO</span>
                                                            }
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* Code Examples Side */}
                            <div className="space-y-6">
                                {/* cURL */}
                                <div className="rounded-2xl bg-[#0d1117] border border-gray-800 overflow-hidden shadow-2xl">
                                    <div className="flex items-center justify-between px-4 py-2.5 bg-[#161b22] border-b border-gray-800">
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                            <Terminal size={12} /> Request Example
                                        </div>
                                        <button 
                                            onClick={() => handleCopy(api.request_example.curl, 'cURL')}
                                            className="p-1.5 hover:bg-gray-700 rounded-md text-gray-400 transition-colors"
                                        >
                                            <Copy size={14} />
                                        </button>
                                    </div>
                                    <pre className="p-5 text-[12px] font-mono text-blue-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                                        {api.request_example.curl}
                                    </pre>
                                </div>

                                {/* Response */}
                                <div className="rounded-2xl bg-[#0d1117] border border-gray-800 overflow-hidden shadow-2xl">
                                    <div className="flex items-center justify-between px-4 py-2.5 bg-[#161b22] border-b border-gray-800">
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                            <CheckCircle2 size={12} className="text-emerald-500" /> Response Example
                                        </div>
                                        <button 
                                            onClick={() => handleCopy(JSON.stringify(api.response_example.success, null, 2), 'Response')}
                                            className="p-1.5 hover:bg-gray-700 rounded-md text-gray-400 transition-colors"
                                        >
                                            <Copy size={14} />
                                        </button>
                                    </div>
                                    <pre className="p-5 text-[12px] font-mono text-emerald-400 overflow-x-auto leading-relaxed">
                                        {JSON.stringify(api.response_example.success, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
}

/* ---------- Shimmer Loading Component ---------- */
function DocShimmer() {
    return (
        <div className="max-w-7xl mx-auto p-8 space-y-12 animate-pulse">
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
                <div className="space-y-3">
                    <div className="h-8 w-64 bg-gray-200 dark:bg-gray-800 rounded" />
                    <div className="h-4 w-96 bg-gray-100 dark:bg-gray-800/50 rounded" />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-28 bg-gray-50 dark:bg-gray-800/40 rounded-2xl border dark:border-gray-800" />
                ))}
            </div>
            <div className="space-y-10">
                <div className="h-10 w-1/2 bg-gray-100 dark:bg-gray-800 rounded-xl" />
                <div className="grid lg:grid-cols-2 gap-10">
                    <div className="h-80 bg-gray-50 dark:bg-gray-800/20 rounded-2xl border dark:border-gray-800" />
                    <div className="space-y-4">
                        <div className="h-40 bg-gray-900 rounded-2xl" />
                        <div className="h-40 bg-gray-900 rounded-2xl" />
                    </div>
                </div>
            </div>
        </div>
    );
}