import axios, { AxiosRequestConfig, AxiosError } from "axios";
import Cookies from "js-cookie";
import { getCachedLocation, resolveLocation } from "./LocationResolver";


export const API_BASE_URL = "https://apiwavepay.pinepe.in/api/";

interface ApiOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  data?: Record<string, any>;
  form_data?: FormData;
  host?: string | null;
  requireLocation?: boolean;
}

/**
 * Returns location headers.
 * If requireLocation is true, attempts resolveLocation() which re-checks
 * browser permission state — so if user just granted after a prior denial,
 * this will pick it up.
 */
const getLocationHeaders = async (requireLocation = false) => {
  if (typeof window === "undefined") return null;

  // If location is required, try to resolve (handles re-grant scenario)
  const loc = requireLocation
    ? await resolveLocation()
    : getCachedLocation();

  if (!loc) return null;

  return {
    latitude: loc.latitude.toString(),
    longitude: loc.longitude.toString(),
  };
};

export const callApi = async <T = any>(
  url: string,
  options: ApiOptions = {}
): Promise<T> => {
  const token = Cookies.get("pinepeAccessToken");

  let host = "";
  if (typeof window !== "undefined") {
    host = window.location.host;
  }

  const isServer = typeof window === "undefined";

  // ✅ Await location — resolveLocation() re-checks permission state
  const locationHeaders = await getLocationHeaders(options.requireLocation);

  if (!isServer && options.requireLocation && !locationHeaders) {
    return {
      success: false,
      code: "LOCATION_REQUIRED",
      message: "Please enable location to continue",
    } as T;
  }

  const config: AxiosRequestConfig = {
    url: API_BASE_URL + url,
    method: options.method || "GET",
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      ...locationHeaders,
      type: "web",
      // domain: host ? host : options?.host,
      domain: "Payoutapi.in",
      // domain:"cashpe.net"
    },
    data: options.data || options.form_data,
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      if (
        axiosError.response?.status === 401 &&
        typeof window !== "undefined"
      ) {
        Cookies.remove("pinepeAccessToken");
        Cookies.remove("pinepeRefreshToken");
        window.location.href = "/";
      }

      return (
        axiosError.response?.data || {
          success: false,
          message: axiosError.message,
        }
      ) as T;
    }

    return { success: false, message: (error as Error).message } as T;
  }
};

export const downloadFile = async (
  endpoint: string,
  fileName: string,
  data: Record<string, any> = {},
  method: "GET" | "POST" = "GET"
) => {
  try {
    const token = Cookies.get("pinepeAccessToken");

    let host = "";
    if (typeof window !== "undefined") {
      host = window.location.host;
    }

    const locationHeaders = await getLocationHeaders();

    const response = await axios({
      url: API_BASE_URL + endpoint,
      method,
      responseType: "blob",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        ...locationHeaders,
        domain: host ? host : "login.nkpay.in",
      },
      data,
    });

    const blob = new Blob([response.data]);
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error("❌ File download failed:", error);
  }
};
