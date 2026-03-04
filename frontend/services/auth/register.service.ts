import { http } from "@/lib/fetch";
import { ApiResponse, UserRole } from "@/types/auth/api";

// Register types
export interface RegisterCredentials {
  email: string;
  username: string;
  full_name: string;
  password: string;
  role: UserRole;
}

export interface RegisterResponse {
  id: string;
  email: string;
  username: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
  avatar_url: string | null;
  points: number;
  created_at: string;
}

// Register function
export const register = async (
  credentials: RegisterCredentials,
): Promise<ApiResponse<RegisterResponse>> => {
  const response = await http.post<RegisterResponse>(
    "/api/v1/auth/register",
    credentials,
  );

  console.log("🔍 Register Response:", response);
  console.log("🔍 Register Data:", response.data);

  if (!response.success || !response.data) {
    throw new Error("Registration failed");
  }

  return response;
};
