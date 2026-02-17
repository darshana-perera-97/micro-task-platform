import React, { createContext, useContext, useState, useEffect } from 'react';

import API_URL from '../config/api';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Check for saved user and token in localStorage
    const savedUser = localStorage.getItem('currentUser');
    const savedToken = localStorage.getItem('authToken');
    
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
      
      // Verify token is still valid by fetching profile
      fetchProfile(savedToken);
    }
  }, []);

  const fetchProfile = async (authToken) => {
    try {
      const response = await fetch(`${API_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUser(data.data);
          localStorage.setItem('currentUser', JSON.stringify(data.data));
        } else {
          // Token invalid, clear storage
          logout();
        }
      } else {
        // Token invalid, clear storage
        logout();
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      logout();
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success && data.data) {
        setUser(data.data.user);
        setToken(data.data.token);
        localStorage.setItem('currentUser', JSON.stringify(data.data.user));
        localStorage.setItem('authToken', data.data.token);
        return true;
      } else {
        // Throw error with message from API
        throw new Error(data.message || 'Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      // If it's already an Error object with message, re-throw it
      if (error instanceof Error) {
        throw error;
      }
      // Otherwise, throw a generic error
      throw new Error('Failed to connect to server. Please make sure the backend is running.');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      fetchProfile,
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

