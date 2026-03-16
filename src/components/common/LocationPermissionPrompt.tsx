"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { resolveLocation } from "@/Utilities/LocationResolver";

const LOCATION_PROMPT_ROUTES = new Set(["/", "/dashboard"]);
const LOCATION_PROMPT_SESSION_KEY = "location_permission_prompted";

export default function LocationPermissionPrompt() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || !LOCATION_PROMPT_ROUTES.has(pathname)) {
      return;
    }

    if (typeof window === "undefined") {
      return;
    }

    const hasPrompted = window.sessionStorage.getItem(LOCATION_PROMPT_SESSION_KEY);
    if (hasPrompted) {
      return;
    }

    window.sessionStorage.setItem(LOCATION_PROMPT_SESSION_KEY, "1");

    resolveLocation().catch(() => {
      // Permission denied/unavailable. We intentionally no-op.
    });
  }, [pathname]);

  return null;
}
