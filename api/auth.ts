import { authFetch } from "@/utils/auth";

const API_URL = 'http://148.113.181.101:8000/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  fullname: string;
  password: string;
  password2: string;
  language_preference: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user?: {
    id: number;
    email: string;
    fullname: string;
  };
  message?: string;
}

/**
 * Login a user with email and password
 */
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/auth/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.detail || 'Login failed');
  }
  
  return data;
};

/**
 * Register a new user
 */
export const register = async (userData: RegisterData): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/auth/register/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    // Format validation errors
    if (data && typeof data === 'object') {
      const errors = Object.entries(data)
        .filter(([_, value]) => Array.isArray(value))
        .map(([key, value]) => `${key}: ${(value as string[]).join(', ')}`)
        .join('\n');
      
      if (errors) {
        throw new Error(errors);
      }
    }
    
    throw new Error(data.detail || 'Registration failed');
  }
  
  return data;
};

/**
 * Refresh the access token
 */
export const refreshToken = async (refresh: string): Promise<{ access: string }> => {
  const response = await fetch(`${API_URL}/auth/refresh/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh }),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.detail || 'Token refresh failed');
  }
  
  return data;
};

/**
 * Logout a user (blacklist refresh token)
 */
export const logout = async (refresh: string): Promise<void> => {
  await authFetch(`${API_URL}/auth/logout/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh }),
  });
};
