import { API_BASE_URL } from '@/app/lib/config';
import { User, ApiResponse, LoginResponse } from '@/app/lib/types';

const getAuthToken = (): string | null => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return null;
  }
  
  const cookies = document.cookie.split(';');
  const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
  return tokenCookie ? tokenCookie.split('=')[1] : null;
};

const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('An unexpected error occurred');
  }
};

// User registration API call
export const userRegistration = async (userData: User): Promise<ApiResponse<User>> => {
    return apiRequest<User>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
      credentials: 'include', 
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };
  
// User login API call
export const userLogin = async (credentials: { email: string; password: string }): Promise<LoginResponse> => {
  const response = await apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
  
  return response as unknown as LoginResponse;
};

// Get user profile API call
export const getUserProfile = async (): Promise<ApiResponse<User>> => {
  return apiRequest<User>('/adminuser/get-profile');
};

// Update user profile API call
export const updateUserProfile = async (userId: string, userData: Partial<User>): Promise<ApiResponse<User>> => {
  return apiRequest<User>(`/update/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  });
};

// Get all users API call
export const getAllUsers = async (): Promise<ApiResponse<User[]>> => {
  return apiRequest<User[]>('/admin/get-all-users');
};

// Get session count by email API call
export const getSessionCountByEmail = async (email: string): Promise<number> => {
  return apiRequest<number>(`/session/count?email=${encodeURIComponent(email)}`)
    .then(res => {
      if (typeof res === 'number') return res;
      if (res && typeof res.data === 'number') return res.data;
      // Fallback
      return 0;
    });
};

// Define a specific type for the session submission response
export interface SubmitSessionResponse {
  success: boolean;
  message: string;
  // Add more fields if your backend returns them
}

// Submit session API call
export const submitSession = async (sessionData: { email: string; duration: number; completedAt: string }): Promise<ApiResponse<SubmitSessionResponse>> => {
  return apiRequest<SubmitSessionResponse>('/session/submit', {
    method: 'POST',
    body: JSON.stringify(sessionData),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const userAPI = {
  registration: userRegistration,
  login: userLogin,
  getProfile: getUserProfile,
  updateProfile: updateUserProfile,
  getAllUsers, 
  getSessionCountByEmail, 
  submitSession,
};

// Default export
export default userAPI;
