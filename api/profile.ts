import { authFetch } from "@/utils/auth";

const API_URL = 'http://127.0.0.1:8000/api';

export interface UserProfile {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  fullname: string;
  language_preference: string;
  date_joined: string;
  last_login: string;
}

export interface ProfileUpdateData {
  fullname?: string;
  email?: string;
  language_preference?: string;
}

export interface PasswordChangeData {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

/**
 * Get the user's profile
 */
export const getUserProfile = async (): Promise<UserProfile> => {
  const response = await authFetch(`${API_URL}/profile/detail/`);
  
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.detail || 'Failed to fetch user profile');
  }
  
  return response.json();
};

/**
 * Update the user's profile
 */
export const updateUserProfile = async (profileData: ProfileUpdateData): Promise<UserProfile> => {
  const response = await authFetch(`${API_URL}/profile/detail/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profileData),
  });
  
  if (!response.ok) {
    const data = await response.json();
    // Format error messages
    const errorMessages = Object.entries(data)
      .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
      .join('\n');
    throw new Error(errorMessages || 'Failed to update profile');
  }
  
  const responseData = await response.json();
  // Handle both old and new response formats
  return responseData.data || responseData;
};

/**
 * Change the user's password
 */
export const changePassword = async (passwordData: PasswordChangeData): Promise<{ detail: string }> => {
  const response = await authFetch(`${API_URL}/profile/change-password/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(passwordData),
  });
  
  if (!response.ok) {
    const data = await response.json();
    // Format error messages
    const errorMessages = Object.entries(data)
      .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
      .join('\n');
    throw new Error(errorMessages || 'Failed to change password');
  }
  
  return response.json();
};
