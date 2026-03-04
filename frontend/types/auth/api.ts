export type UserRole = "ADMIN" | "USER" | "TEEN" | "MENTOR";

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: {
    timestamp?: string;
    version?: string;
  };
  requestId?: string;
  status: number;
}

export interface BackendErrorResponse {
  success: false;
  message?: string;
  error?: {
    code?: string;
    message?: string;
    details?: unknown;
  };
}

export interface CustomError extends Error {
  code?: string;
  status?: number;
  data?: BackendErrorResponse;
}
