"use client";
import React, { useState, useMemo } from "react";
import { Key, ShieldCheck, Globe, Info, Plus, X } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";

interface GenerateCredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: { allowed_ips: string[]; callback_url: string }) => void;
  loading?: boolean;
}

export default function GenerateCredentialsModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  loading 
}: GenerateCredentialsModalProps) {
  const [formData, setFormData] = useState({
    allowed_ips: "",
    callback_url: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Helper to visualize the IPs being parsed in real-time
  const ipPreview = useMemo(() => {
    return formData.allowed_ips
      .split(",")
      .map((ip) => ip.trim())
      .filter((ip) => ip !== "");
  }, [formData.allowed_ips]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      allowed_ips: ipPreview,
      callback_url: formData.callback_url,
    });
  };

  return (
    // Increased max-width to 850px for a "wider" feel
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[850px]">
      <div className="bg-white dark:bg-gray-900 rounded-[1.5rem] overflow-hidden shadow-2xl border dark:border-gray-800">
        
        {/* Header - Compact Height */}
        <div className="px-8 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-500 rounded-lg text-white">
              <Key size={20} />
            </div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white">API Configuration</h4>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={20}/></button>
        </div>

        {/* Body - Two Column Grid to reduce height */}
        <div className="p-8">
          <form id="creds-form" onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Left Column: URL Settings */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Globe size={18} className="text-brand-500" />
                <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Endpoint Settings</Label>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">Webhook / Callback URL</Label>
                <Input
                  name="callback_url" 
                  type="url"
                  value={formData.callback_url} 
                  onChange={handleChange} 
                  placeholder="https://api.site.com/callback" 
                  required 
                  className="h-11"
                />
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed italic">
                <Info size={12} className="inline mr-1" /> 
                System will send POST updates to this URL.
              </p>
            </div>

            {/* Right Column: IP Settings */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-brand-500" />
                <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Security / Whitelist</Label>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">Allowed IP Addresses</Label>
                <Input 
                  name="allowed_ips" 
                  value={formData.allowed_ips} 
                  onChange={handleChange} 
                  placeholder="1.1.1.1, 2.2.2.2" 
                  required 
                  className="h-11"
                />
              </div>

              {/* IP Preview Tags - Helps user verify multiple IPs */}
              <div className="flex flex-wrap gap-1.5 min-h-[32px]">
                {ipPreview.length > 0 ? (
                  ipPreview.map((ip, index) => (
                    <span key={index} className="px-2 py-0.5 bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 text-[10px] font-mono rounded border border-brand-100 dark:border-brand-500/20">
                      {ip}
                    </span>
                  ))
                ) : (
                  <span className="text-[10px] text-gray-400 italic">No IPs added yet</span>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Footer - Compact */}
        <div className="px-8 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-white/5 flex items-center justify-between">
          <div className="hidden sm:block">
             <p className="text-[10px] text-gray-400 max-w-[300px]">
               By generating keys, you agree to secure your Client Secret.
             </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="px-5 h-10 rounded-xl text-sm">
              Cancel
            </Button>
            <Button 
              form="creds-form" 
              type="submit" 
              disabled={loading} 
              className="px-8 h-10 rounded-xl bg-brand-500 text-white font-bold shadow-lg shadow-brand-500/30 flex items-center gap-2 text-sm"
            >
              {loading ? "Processing..." : <><Plus size={16} /> Generate Keys</>}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}