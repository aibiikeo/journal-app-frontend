import axios from 'axios'

// export const BASE_URL = 'http://64.23.185.31:8080'
export const BASE_URL = 'http://localhost:8080'

export const apiClient = axios.create({
  baseURL: BASE_URL,
  // headers: {
  //   'Content-Type': 'application/json',
  // },
});

// Request Interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `${token}`;
  }
  return config;
}, (error) => {
  console.error('Request Error:', error);
  return Promise.reject(error);
});

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Optionally notify the user (e.g., show a toast notification)
      console.warn('Unauthorized! Redirecting to login...');
      localStorage.removeItem('authToken'); // Clear token
      window.location.href = '/login'; // Redirect to login
    } else if (error.response?.status === 500) {
      console.error('Server Error:', error.response.data?.message || 'Internal Server Error');
    }
    return Promise.reject(error);
  }
);


