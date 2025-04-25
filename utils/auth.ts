// Authentication utility functions

/**
 * Get the access token from localStorage
 */
export const getAccessToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
};

/**
 * Get the refresh token from localStorage
 */
export const getRefreshToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('refreshToken');
};

/**
 * Store authentication tokens in localStorage
 */
export const storeTokens = (accessToken: string, refreshToken: string): void => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

/**
 * Remove authentication tokens from localStorage
 */
export const removeTokens = (): void => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};

/**
 * Check if the user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!getAccessToken();
};

/**
 * Refresh the access token using the refresh token
 */
export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await fetch('/api/auth/refresh/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }
    
    const data = await response.json();
    localStorage.setItem('accessToken', data.access);
    
    return data.access;
  } catch (error) {
    console.error('Error refreshing token:', error);
    removeTokens(); // Clear tokens on refresh failure
    return null;
  }
};

/**
 * Fetch with authentication and token refresh
 */
export const authFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  // Try with current access token
  let accessToken = getAccessToken();
  
  // Set up headers with authentication
  const headers = new Headers(options.headers || {});
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }
  
  // Make the request
  let response = await fetch(url, {
    ...options,
    headers,
  });
  
  // If unauthorized and we have a refresh token, try to refresh
  if (response.status === 401 && getRefreshToken()) {
    const newToken = await refreshAccessToken();
    
    // If token refresh was successful, retry the request
    if (newToken) {
      headers.set('Authorization', `Bearer ${newToken}`);
      response = await fetch(url, {
        ...options,
        headers,
      });
    }
  }
  
  return response;
};

/**
 * Logout the user
 */
export const logout = async (): Promise<boolean> => {
  try {
    const refreshToken = getRefreshToken();
    
    if (refreshToken) {
      // Call the logout endpoint to blacklist the refresh token
      await fetch('/api/auth/logout/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAccessToken()}`,
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });
    }
    
    // Remove tokens regardless of API response
    removeTokens();
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    // Still remove tokens even if the API call fails
    removeTokens();
    return false;
  }
};
