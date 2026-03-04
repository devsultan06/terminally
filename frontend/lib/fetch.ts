import {
  ApiResponse,
  BackendErrorResponse,
  CustomError,
} from "@/types/auth/api";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Build full URL with query params if provided
const buildUrl = (
  endpoint: string,
  params?: Record<string, string | number | boolean>,
) => {
  const url = new URL(endpoint, BASE_URL);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  return url.toString();
};

interface RequestOptions<B = unknown> {
  body?: B;
  params?: Record<string, string | number | boolean>;
  headers?: Record<string, string>;
}

// Main request function
const request = async <T, B = unknown>(
  method: string,
  endpoint: string,
  options?: RequestOptions<B>,
): Promise<ApiResponse<T>> => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const url = buildUrl(endpoint, options?.params);

  // ✅ Detect if body is FormData
  const isFormData = options?.body instanceof FormData;

  const config: RequestInit = {
    method,
    headers: {
      // Only set Content-Type for non-FormData requests
      ...(!isFormData && { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers || {}),
    },
    // Don't stringify FormData - pass it directly
    body: options?.body
      ? isFormData
        ? (options.body as unknown as FormData)
        : JSON.stringify(options.body)
      : undefined,
  };

  // ... rest of your code stays the same
  let response: Response;

  try {
    if (typeof window !== "undefined" && !navigator.onLine) {
      throw new Error("NETWORK_OFFLINE");
    }

    response = await fetch(url, config);
  } catch (fetchError: unknown) {
    // ... your existing error handling ...
    if (
      fetchError instanceof Error &&
      fetchError.message === "NETWORK_OFFLINE"
    ) {
      const error = new Error(
        "You are currently offline. Please check your internet connection.",
      ) as CustomError;
      error.code = "NETWORK_OFFLINE";
      error.status = 0;
      throw error;
    }

    if (fetchError instanceof TypeError) {
      const errorMessage = fetchError.message.toLowerCase();

      if (errorMessage.includes("failed to fetch")) {
        try {
          new URL(url);
          const currentOrigin =
            typeof window !== "undefined" ? window.location.origin : "";

          if (currentOrigin && !url.startsWith(currentOrigin)) {
            const error = new Error(
              "CORS error: The API server is not configured to accept requests from this domain. Please contact your system administrator.",
            ) as CustomError;
            error.code = "CORS_ERROR";
            error.status = 0;
            throw error;
          }
        } catch {
          // If URL parsing fails, fall through to generic handling
        }
      }

      if (
        errorMessage.includes("network request failed") ||
        errorMessage.includes("load failed") ||
        errorMessage.includes("connection") ||
        errorMessage.includes("timeout") ||
        errorMessage.includes("dns") ||
        errorMessage.includes("unreachable")
      ) {
        const error = new Error(
          "Network error. Please check your internet connection and try again.",
        ) as CustomError;
        error.code = "NETWORK_ERROR";
        error.status = 0;
        throw error;
      }

      if (errorMessage.includes("failed to fetch")) {
        const error = new Error(
          "Unable to connect to the server. This may be due to server configuration or network issues.",
        ) as CustomError;
        error.code = "FETCH_ERROR";
        error.status = 0;
        throw error;
      }
    }

    throw fetchError;
  }

  const contentType = response.headers.get("content-type");
  let data: unknown = null;
  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
    console.log("🔍 Response JSON Data:", data);
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const errorData = data as BackendErrorResponse;
    const errorMessage =
      errorData?.error?.message ||
      errorData?.message ||
      `Error ${response.status}`;

    const error = new Error(errorMessage) as CustomError;
    error.data = errorData;
    error.status = response.status;
    error.code = errorData?.error?.code;

    throw error;
  }

  return {
    success: (data as { success?: boolean })?.success ?? true,
    data: (data as ApiResponse<T>).data as T,
    message: (data as { message?: string })?.message,
    meta: (data as { meta?: { timestamp?: string; version?: string } })?.meta,
    requestId: (data as { requestId?: string })?.requestId,
    status: response.status,
  };
};

export const http = {
  get: <T>(
    endpoint: string,
    params?: Record<string, string | number | boolean>,
  ) => request<T>("GET", endpoint, { params }),
  post: <T, B = unknown>(endpoint: string, body?: B) =>
    request<T, B>("POST", endpoint, { body }),
  put: <T, B = unknown>(endpoint: string, body?: B) =>
    request<T, B>("PUT", endpoint, { body }),
  del: <T>(endpoint: string) => request<T>("DELETE", endpoint),
};
