// This file was renamed from backendContext.tsx to appContext.tsx
import React, { createContext, useContext, ReactNode } from 'react';

interface AppContextProps {
  baseUrl: string;
  get: (endpoint: string, options?: RequestInit) => Promise<any>;
  post: (endpoint: string, body: any, options?: RequestInit) => Promise<any>;
  put: (endpoint: string, body: any, options?: RequestInit) => Promise<any>;
  del: (endpoint: string, options?: RequestInit) => Promise<any>;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const baseUrl = 'http://localhost:5000'; // Change to your backend URL

  const get = async (endpoint: string, options: RequestInit = {}) => {
    const res = await fetch(`${baseUrl}${endpoint}`, {
      ...options,
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });
    return res.json();
  };

  const post = async (endpoint: string, body: any, options: RequestInit = {}) => {
    const res = await fetch(`${baseUrl}${endpoint}`, {
      ...options,
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      body: JSON.stringify(body),
    });
    return res.json();
  };

  const put = async (endpoint: string, body: any, options: RequestInit = {}) => {
    const res = await fetch(`${baseUrl}${endpoint}`, {
      ...options,
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      body: JSON.stringify(body),
    });
    return res.json();
  };

  const del = async (endpoint: string, options: RequestInit = {}) => {
    const res = await fetch(`${baseUrl}${endpoint}`, {
      ...options,
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });
    return res.json();
  };

  return (
    <AppContext.Provider value={{ baseUrl, get, post, put, del }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
