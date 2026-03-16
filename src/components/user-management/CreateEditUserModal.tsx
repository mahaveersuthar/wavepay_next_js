"use client";
import React, { useEffect, useState } from "react";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { Eye, EyeOff } from "lucide-react"; // Import icons

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingUser: any;
  onSubmit: (payload: any) => void;
  loading?: boolean;
}

export default function UserModal({
  isOpen,
  onClose,
  editingUser,
  onSubmit,
  loading
}: UserModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
    tds: "5",
    gst: "18",
    service_charge: "10",
    type: "merchant",
    role: "user",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowPassword(false); // Reset visibility when modal opens
      setShowConfirmPassword(false);
      
      if (editingUser) {
        setFormData({
          name: editingUser.name || "",
          email: editingUser.email || "",
          phone: editingUser.phone || editingUser.mobile || "",
          password: "",
          password_confirmation: "",
          tds: editingUser.tds || "5",
          gst: editingUser.gst || "18",
          service_charge: editingUser.service_charge || "10",
          type: editingUser.type || "merchant",
          role: "user",
        });
      } else {
        setFormData({
          name: "", email: "", phone: "", password: "",
          password_confirmation: "", tds: "5", gst: "18",
          service_charge: "10", type: "merchant", role: "user",
        });
      }
    }
  }, [editingUser, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalPayload = { ...formData, role: "user", type: "merchant" };
    
    if (editingUser && !finalPayload.password) {
      delete (finalPayload as any).password;
      delete (finalPayload as any).password_confirmation;
    }
    
    onSubmit(finalPayload);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[580px]">
      <div className="bg-white dark:bg-gray-900 rounded-[1.5rem] overflow-hidden border dark:border-gray-800 shadow-xl">
        
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
          <h4 className="text-lg font-bold text-gray-900 dark:text-white">
            {editingUser ? "Edit User Profile" : "Create New Merchant"}
          </h4>
        </div>

        <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
          <form id="user-form" className="space-y-4" onSubmit={handleFormSubmit}>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm">Full Name</Label>
                <Input name="name" value={formData.name} onChange={handleChange} placeholder="Mohit Khandelwal" required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">Phone Number</Label>
                <Input maxLength={10} name="phone" value={formData.phone} onChange={handleChange} placeholder="8209832665" required />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm">Email Address</Label>
              <Input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="mohit@gmail.com" required />
            </div>

            {!editingUser && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Password Field */}
                  <div className="space-y-1.5">
                    <Label className="text-sm">Password</Label>
                    <Input 
                      name="password" 
                      type={showPassword ? "text" : "password"} 
                      value={formData.password} 
                      onChange={handleChange} 
                      required 
                      endIcon={
                        <button 
                          type="button" 
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-gray-400 hover:text-gray-600 focus:outline-none"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      }
                    />
                  </div>
                  {/* Confirm Password Field */}
                  <div className="space-y-1.5">
                    <Label className="text-sm">Confirm Password</Label>
                    <Input 
                      name="password_confirmation" 
                      type={showConfirmPassword ? "text" : "password"} 
                      value={formData.password_confirmation} 
                      onChange={handleChange} 
                      required 
                      endIcon={
                        <button 
                          type="button" 
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="text-gray-400 hover:text-gray-600 focus:outline-none"
                        >
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">TDS (%)</Label>
                    <Input name="tds" type="number" value={formData.tds} onChange={handleChange} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">GST (%)</Label>
                    <Input name="gst" type="number" value={formData.gst} onChange={handleChange} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Fee (₹)</Label>
                    <Input name="service_charge" type="number" value={formData.service_charge} onChange={handleChange} />
                  </div>
                </div>
              </>
            )}
          </form>
        </div>

        <div className="p-5 px-6 border-t border-gray-100 dark:border-gray-800 flex gap-3">
          <Button variant="outline" className="flex-1 rounded-xl h-11 text-sm" onClick={onClose}>
            Discard
          </Button>
          <Button form="user-form" type="submit" disabled={loading} className="flex-[1.5] rounded-xl bg-brand-500 text-white h-11 text-sm font-semibold">
            {loading ? "Processing..." : editingUser ? "Update Profile" : "Create Account"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}