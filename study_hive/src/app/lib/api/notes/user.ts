import { API_BASE_URL } from "@/app/lib/config";

export type User = {
  name: string;
  email: string;
};

export type Note = {
  filename: string;
  contentType: string;
};

export interface ApiResponse<T> {
  user?: T;
}

// Get auth token from cookie
export const getAuthToken = (): string | null => {
  if (typeof document === "undefined") return null;
  const cookies = document.cookie.split(";");
  const tokenCookie = cookies.find((c) => c.trim().startsWith("token="));
  return tokenCookie ? tokenCookie.split("=")[1] : null;
};

// Generic API request
export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();

  const config: RequestInit = {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    credentials: "include",
    ...options,
  };

  const res = await fetch(url, config);
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "Request failed");
  }

  return res.json();
};

// Get profile
export const getUserProfile = async (): Promise<ApiResponse<User>> => {
  return apiRequest<ApiResponse<User>>("/adminuser/get-profile");
};

// (Optional helper)
export const getNotesByEmail = async (): Promise<Note[]> => {
  return apiRequest<Note[]>("/notes/get-note-by-email");
};
