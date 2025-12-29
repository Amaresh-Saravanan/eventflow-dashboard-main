import api from './api';
import { useAuth } from '@clerk/clerk-react';
import { AxiosRequestConfig } from 'axios';

export const useAuthenticatedApi = () => {
  const { getToken } = useAuth();

  const get = async (url: string, config?: AxiosRequestConfig) => {
    const token = await getToken();
    return api.get(url, {
      ...config,
      headers: { 
        ...config?.headers, 
        Authorization: `Bearer ${token}` 
      }
    });
  };

  const post = async (url: string, data?: any, config?: AxiosRequestConfig) => {
    const token = await getToken();
    return api.post(url, data, {
      ...config,
      headers: { 
        ...config?.headers, 
        Authorization: `Bearer ${token}` 
      }
    });
  };

  const put = async (url: string, data?: any, config?: AxiosRequestConfig) => {
    const token = await getToken();
    return api.put(url, data, {
      ...config,
      headers: { 
        ...config?.headers, 
        Authorization: `Bearer ${token}` 
      }
    });
  };

  const del = async (url: string, config?: AxiosRequestConfig) => {
    const token = await getToken();
    return api.delete(url, {
      ...config,
      headers: { 
        ...config?.headers, 
        Authorization: `Bearer ${token}` 
      }
    });
  };

  return { get, post, put, delete: del };
};