"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";
import { callApi } from "@/Utilities/CallApi";
import { ApiRoutes } from "@/Utilities/ApiRoutes";

export interface UserProfile {
  id?: number;
  parent_id?: number | null;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  username?: string;
  role?: string;
  status?: string;
  otp_verified_at?: string | null;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  image?: string | null;
  email_verified_at?: string | null;
  created_at?: string;
  updated_at?: string;
  wallet_balance?: string;
  hold_balance?: string;
  [key: string]: any;
}

interface ProfileContextValue {
  profile: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  refreshProfile: () => Promise<UserProfile | null>;
  setProfileData: (data: Partial<UserProfile> | UserProfile | null) => void;
}

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

const extractProfileFromResponse = (response: any): UserProfile | null => {
  if (!response || typeof response !== "object") return null;

  const nestedData = response?.data?.data;
  if (nestedData && typeof nestedData === "object" && !Array.isArray(nestedData)) {
    return nestedData as UserProfile;
  }

  const directData = response?.data;
  if (directData && typeof directData === "object" && !Array.isArray(directData)) {
    return directData as UserProfile;
  }

  if (response?.user && typeof response.user === "object") {
    return response.user as UserProfile;
  }

  return null;
};

export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = useCallback(async (): Promise<UserProfile | null> => {
    const token = Cookies.get("pinepeAccessToken");
    if (!token) {
      setProfile(null);
      setLoading(false);
      return null;
    }

    setLoading(true);
    try {
      const response = await callApi<any>(ApiRoutes.profile);
      const user = extractProfileFromResponse(response);
      setProfile(user);
      return user;
    } catch {
      setProfile(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const setProfileData = useCallback((data: Partial<UserProfile> | UserProfile | null) => {
    if (data === null) {
      setProfile(null);
      return;
    }

    setProfile((prev) => ({ ...(prev || {}), ...data }));
  }, []);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  const value = useMemo(
    () => ({
      profile,
      loading,
      isAuthenticated: Boolean(Cookies.get("pinepeAccessToken")),
      refreshProfile,
      setProfileData,
    }),
    [profile, loading, refreshProfile, setProfileData]
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within ProfileProvider");
  }
  return context;
};
