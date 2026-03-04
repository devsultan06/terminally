import { http } from "@/lib/fetch";
import { UserRole, ApiResponse } from "@/types/auth/api";

// Login types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UserData {
  id: string;
  email: string;
  username: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
  otp_verified: boolean;
  avatar_url: string | null;
  points: number;
  created_at: string;
}

export interface LoginSuccessData {
  access_token: string;
  refresh_token: string;
  user: UserData;
}

export interface LoginOtpRequiredData {
  otp_verified: boolean;
  email: string;
}

export type LoginResponseData = LoginSuccessData | LoginOtpRequiredData;

// Login function
export const login = async (
  credentials: LoginCredentials,
): Promise<ApiResponse<LoginResponseData>> => {
  const response = await http.post<LoginResponseData>(
    "/api/v1/auth/login",
    credentials,
  );

  console.log("🔍 Login Response:", response);

  if (!response.success || !response.data) {
    throw new Error(response.message || "Login failed");
  }

  return response;
};
