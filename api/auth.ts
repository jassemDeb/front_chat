import { authFetch } from "@/utils/auth";
import env from "@/utils/env";

// Use relative API URL for proxied requests
const API_URL = '/api';

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
  try {
    console.log('Attempting login with credentials:', { email: credentials.email, passwordLength: credentials.password?.length });
    console.log('API URL:', `${API_URL}/auth/login/`);
    
    const response = await fetch(`${API_URL}/auth/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
      // Add credentials: 'include' to ensure cookies are sent with the request
      credentials: 'include',
    });
    
    console.log('Login response status:', response.status);
    
    // Try to get response text first to handle potential non-JSON responses
    const responseText = await response.text();
    console.log('Login response text:', responseText);
    
    // Then parse as JSON if possible
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Error parsing JSON response:', e);
      throw new Error('Invalid response format from server');
    }
    
    if (!response.ok) {
      throw new Error(data.detail || 'Login failed');
    }
    
    return data;
  } catch (error) {
    console.error('Login error details:', error);
    throw error;
  }
};

/**
 * Register a new user
 */
export const register = async (userData: RegisterData): Promise<AuthResponse> => {
  try {
    console.log('Attempting registration with data:', { 
      email: userData.email, 
      fullname: userData.fullname,
      passwordLength: userData.password?.length,
      language: userData.language_preference 
    });
    
    const response = await fetch(`${API_URL}/auth/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
      credentials: 'include',
    });
    
    console.log('Registration response status:', response.status);
    
    // Try to get response text first to handle potential non-JSON responses
    const responseText = await response.text();
    console.log('Registration response text:', responseText);
    
    // Then parse as JSON if possible
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Error parsing JSON response:', e);
      throw new Error('Invalid response format from server');
    }
    
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
  } catch (error) {
    console.error('Registration error details:', error);
    throw error;
  }
};

/**
 * Refresh the access token
 */
export const refreshToken = async (refresh: string): Promise<{ access: string }> => {
  try {
    console.log('Attempting to refresh token');
    
    const response = await fetch(`${API_URL}/auth/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh }),
      credentials: 'include',
    });
    
    console.log('Token refresh response status:', response.status);
    
    // Try to get response text first to handle potential non-JSON responses
    const responseText = await response.text();
    console.log('Token refresh response text:', responseText);
    
    // Then parse as JSON if possible
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Error parsing JSON response:', e);
      throw new Error('Invalid response format from server');
    }
    
    if (!response.ok) {
      throw new Error(data.detail || 'Token refresh failed');
    }
    
    return data;
  } catch (error) {
    console.error('Token refresh error details:', error);
    throw error;
  }
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
