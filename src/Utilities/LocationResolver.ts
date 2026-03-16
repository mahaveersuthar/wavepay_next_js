let cachedLocation: {
  latitude: number;
  longitude: number;
} | null = null;

let locationRequestInProgress: Promise<any> | null = null;

const PERMISSION_ASKED_KEY = "locationPermissionAsked";
const LOCATION_KEY = "userLocation";

/**
 * Check actual browser permission state (granted / denied / prompt)
 */
const getBrowserPermissionState = async (): Promise<PermissionState | null> => {
  if (typeof navigator === "undefined" || !navigator.permissions) return null;
  try {
    const result = await navigator.permissions.query({ name: "geolocation" });
    return result.state; // "granted" | "denied" | "prompt"
  } catch {
    return null;
  }
};

/**
 * Check if location permission was already asked in this session
 */
export const hasAskedForLocation = (): boolean => {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(PERMISSION_ASKED_KEY) === "true";
};

/**
 * Mark that location permission was asked
 */
export const markLocationAsked = (): void => {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(PERMISSION_ASKED_KEY, "true");
};

/**
 * Get cached location WITHOUT triggering permission request
 */
export const getCachedLocation = (): {
  latitude: number;
  longitude: number;
} | null => {
  if (cachedLocation) return cachedLocation;

  if (typeof window === "undefined") return null;

  const stored = sessionStorage.getItem(LOCATION_KEY);
  if (!stored) return null;

  try {
    cachedLocation = JSON.parse(stored);
    return cachedLocation;
  } catch {
    console.warn("Failed to parse cached location:", stored);
    return null;
  }
};

/**
 * Resolve location with smart permission re-check.
 *
 * Key behavior:
 * - If user previously denied but has now granted in browser settings → re-fetches ✅
 * - If truly denied (browser level) → returns null without prompting again ✅
 * - If never asked → asks once ✅
 * - Deduplicates concurrent calls ✅
 */
export const resolveLocation = async (): Promise<{
  latitude: number;
  longitude: number;
} | null> => {
  if (typeof window === "undefined") return null;

  // 1️⃣ In-memory cache
  if (cachedLocation) return cachedLocation;

  // 2️⃣ Session storage cache
  const cached = getCachedLocation();
  if (cached) return cached;

  // 3️⃣ Check actual browser permission state FIRST
  const permState = await getBrowserPermissionState();

  if (permState === "denied") {
    // Browser has hard-denied — no point prompting, it won't show
    return null;
  }

  if (permState === "granted") {
    // User has granted (possibly after previously denying) — fetch silently
    // Clear the "asked" flag so we don't short-circuit below
    sessionStorage.removeItem(PERMISSION_ASKED_KEY);
  }

  // 4️⃣ If permission is "prompt" and we already asked → don't re-prompt
  if (permState === "prompt" && hasAskedForLocation()) {
    return null;
  }

  // 5️⃣ Prevent duplicate concurrent popup requests
  if (locationRequestInProgress) {
    return locationRequestInProgress;
  }

  // 6️⃣ Ask / silently fetch
  markLocationAsked();

  locationRequestInProgress = new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        cachedLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        sessionStorage.setItem(LOCATION_KEY, JSON.stringify(cachedLocation));
        resolve(cachedLocation);
      },
      (error) => {
        console.warn("❌ Location denied or unavailable:", error);
        resolve(null);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5 * 60 * 1000,
      }
    );
  });

  const result = await locationRequestInProgress;
  locationRequestInProgress = null;
  return result;
};

/**
 * Clear location cache (logout / testing)
 */
export const clearLocationCache = (): void => {
  cachedLocation = null;
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(LOCATION_KEY);
    sessionStorage.removeItem(PERMISSION_ASKED_KEY);
  }
};