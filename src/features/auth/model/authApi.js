import { apiClient } from '@shared/api/axios'

export const login = async (credentials) => {
  const response = await apiClient.post('/trusted/auth/login', credentials);
  return response.data; // Save token from this response
};

export const register = async (credentials) => {
  const response = await apiClient.post('/trusted/auth/signup', credentials);
  return response.data;
};