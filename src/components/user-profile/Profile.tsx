"use client"
import { useEffect, useState, ChangeEvent, useMemo } from "react"
import { callApi } from "@/Utilities/CallApi"
import { ApiRoutes } from "@/Utilities/ApiRoutes"
import React from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Image from "next/image";
import { toast } from "react-toastify";
import { city as cityData } from "../../Utilities/data" 
import Select from "../ui/select/select";
import { useProfile } from "@/context/ProfileContext";



const Profile = () => {
    const { profile: userData, loading, setProfileData, refreshProfile } = useProfile();
    const [isSaving, setIsSaving] = useState(false);
    const [avatarSrc, setAvatarSrc] = useState("/images/user/user_logo.png");

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        country: "India"
    });

    const { isOpen, openModal, closeModal } = useModal();

    // Prepare State and City options for the Select components
    const stateOptions = useMemo(() => {
        return Object.keys(cityData).map((state) => ({
            label: state,
            value: state,
        }));
    }, []);

    const cityOptions = useMemo(() => {
        const stateName = formData.state as keyof typeof cityData;
        if (!stateName || !cityData[stateName]) return [];
        return cityData[stateName].map((cityName: string) => ({
            label: cityName,
            value: cityName,
        }));
    }, [formData.state]);

    useEffect(() => {
        if (!userData) return;

        const rawImage = userData?.image;
        const normalizedImage =
            typeof rawImage === "string" && rawImage.trim()
                ? rawImage.startsWith("http") || rawImage.startsWith("/")
                    ? rawImage
                    : `/${rawImage}`
                : "/images/user/user_logo.png";
        setAvatarSrc(normalizedImage);

        setFormData({
            first_name: userData?.first_name || "",
            last_name: userData?.last_name || "",
            phone: userData?.phone || "",
            address: userData?.address || "",
            city: userData?.city || "",
            state: userData?.state || "",
            zip: userData?.zip || "",
            country: userData?.country || "India"
        });
    }, [userData]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newData = { ...prev, [name]: value };
            if (name === "state") newData.city = ""; // Reset city if state changes
            return newData;
        });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSaving(true);
            await callApi(ApiRoutes.profile, {
                method: 'PUT',
                data: formData
            });

            setProfileData(formData);
            await refreshProfile();
            toast.success("Profile updated successfully");
            closeModal();
        } catch (error: any) {
            toast.error(error.message || "Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    };

    // Render Shimmer while loading
    if (loading) return <ProfileShimmer />;
    if (!userData) {
        return (
            <div className="max-w-6xl mx-auto">
                <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Profile data is not available right now.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-8">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white/90">My Profile</h3>
                    <button onClick={openModal} className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.05]">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        Edit Profile
                    </button>
                </div>

                <div className="space-y-8">
                    {/* Header Section */}
                    <div className="flex flex-col items-center gap-6 pb-8 border-b border-gray-100 dark:border-gray-800 xl:flex-row">
                        <div className="relative w-24 h-24 overflow-hidden border-2 border-blue-500 rounded-full p-1">
                            <Image
                                width={96}
                                height={96}
                                className="object-cover rounded-full"
                               src={avatarSrc}
                                alt="user"
                                onError={() => setAvatarSrc("/images/user/user_logo.png")}
                            />
                        </div>
                        <div className="text-center xl:text-left">
                            <h4 className="text-2xl font-bold text-gray-800 dark:text-white/90">{userData?.first_name} {userData?.last_name}</h4>
                            <div className="flex flex-wrap justify-center gap-3 mt-1 xl:justify-start">
                                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{userData?.role ==='admin'?'Super Admin':"Admin"}</span>
                                <span className="text-gray-300 dark:text-gray-700">|</span>
                                <span className="text-sm text-gray-500">{userData?.city}, {userData?.country}</span>
                            </div>
                        </div>
                    </div>

                    {/* Information Grid */}
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Personal Information</h4>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <DetailItem label="Email" value={userData?.email} />
                                <DetailItem label="Phone" value={userData?.phone} />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Location Details</h4>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <DetailItem label="Address" value={userData?.address} />
                                <DetailItem label="City/State" value={`${userData?.city}, ${userData?.state}`} />
                                <DetailItem label="Postal Code" value={userData?.zip} />
                                <DetailItem label="Country" value={userData?.country} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[450px] m-4">
                <div className="relative w-full bg-white rounded-3xl dark:bg-gray-900 overflow-hidden flex flex-col max-h-[90vh]">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                        <h4 className="text-xl font-bold text-gray-800 dark:text-white/90">Edit Profile</h4>
                    </div>

                    <form onSubmit={handleSave} className="flex flex-col flex-1 overflow-hidden">
                        <div className="p-6 overflow-y-auto custom-scrollbar space-y-5">
                            <div className="grid grid-cols-1 gap-5">
                                <div><Label>First Name</Label><Input name="first_name" type="text" value={formData.first_name} onChange={handleInputChange} /></div>
                                <div><Label>Last Name</Label><Input name="last_name" type="text" value={formData.last_name} onChange={handleInputChange} /></div>
                                <div><Label>Phone Number</Label><Input name="phone" type="text" value={formData.phone} onChange={handleInputChange} /></div>
                                
                                <Select label="State" name="state" value={formData.state} options={stateOptions} placeholder="Select State" onChange={(e: any) => handleInputChange(e)} />
                                <Select label="City" name="city" value={formData.city} options={cityOptions} placeholder={formData.state ? "Select City" : "Select state first"} disabled={!formData.state} onChange={handleInputChange} />
                                
                                <div><Label>Street Address</Label><Input name="address" type="text" value={formData.address} onChange={handleInputChange} /></div>
                                <div><Label>ZIP / Postal Code</Label><Input name="zip" type="text" value={formData.zip} onChange={handleInputChange} /></div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-3 bg-gray-50/50 dark:bg-white/[0.02]">
                            <Button type="button" variant="outline" size="sm" onClick={closeModal}>Cancel</Button>
                            <Button type="submit" size="sm" disabled={isSaving}>{isSaving ? "Saving..." : "Save Changes"}</Button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
};

const ProfileShimmer = () => (
  <div className="max-w-6xl mx-auto animate-pulse">
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-8">
      {/* Header Shimmer */}
      <div className="flex items-center justify-between mb-8">
        <div className="h-7 w-32 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
        <div className="h-10 w-28 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      </div>

      <div className="space-y-8">
        {/* Avatar Section Shimmer */}
        <div className="flex flex-col items-center gap-6 pb-8 border-b border-gray-100 dark:border-gray-800 xl:flex-row">
          <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          <div className="space-y-3 flex-1">
            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          </div>
        </div>

        {/* Grid Shimmer */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {[1, 2].map((group) => (
            <div key={group} className="space-y-4">
              <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded-md mb-6"></div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="space-y-2">
                    <div className="h-3 w-16 bg-gray-100 dark:bg-gray-800 rounded"></div>
                    <div className="h-5 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const DetailItem = ({ label, value }: { label: string, value?: string }) => (
    <div>
        <p className="text-xs font-medium text-gray-400 mb-1">{label}</p>
        <p className="text-sm font-semibold text-gray-800 dark:text-white/90">{value || "N/A"}</p>
    </div>
);

export default Profile;
