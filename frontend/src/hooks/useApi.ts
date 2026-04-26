import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { useMemo } from 'react';

// You can move this to an environment variable in production
const API_BASE_URL = 'http://localhost:3000/api/v1';

export const useApi = () => {
  const { getToken } = useAuth();

  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    instance.interceptors.request.use(async (config) => {
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    return instance;
  }, [getToken]);

  return api;
};
