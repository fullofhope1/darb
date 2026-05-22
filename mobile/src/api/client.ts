import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE = __DEV__ ? 'http://10.0.2.2:5000/api' : 'https://darb-jus8.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const auth = {
  login: (data: { phone: string; password: string }) => api.post('/auth/login', data),
  register: (data: { name: string; phone: string; password: string; role: string }) => api.post('/auth/register', data),
  sendOtp: (phone: string) => api.post('/auth/send-otp', { phone }),
  verifyOtp: (phone: string, code: string) => api.post('/auth/verify-otp', { phone, code }),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data: any) => api.put('/auth/profile', data),
};

export const services = {
  list: (params?: any) => api.get('/services', { params }),
  getById: (id: number) => api.get(`/services/${id}`),
  create: (data: any) => api.post('/services', data),
  update: (id: number, data: any) => api.put(`/services/${id}`, data),
  delete: (id: number) => api.delete(`/services/${id}`),
  getByCategory: (categoryId: number, params?: any) => api.get(`/services/category/${categoryId}`, { params }),
  search: (q: string) => api.get('/services/search', { params: { q } }),
};

export const requests = {
  list: (params?: any) => api.get('/requests', { params }),
  getById: (id: number) => api.get(`/requests/${id}`),
  create: (data: any) => api.post('/requests', data),
  update: (id: number, data: any) => api.put(`/requests/${id}`, data),
  delete: (id: number) => api.delete(`/requests/${id}`),
};

export const offers = {
  create: (data: any) => api.post('/offers', data),
  accept: (id: number) => api.put(`/offers/${id}/accept`),
  reject: (id: number) => api.put(`/offers/${id}/reject`),
  getByRequest: (requestId: number) => api.get(`/offers/request/${requestId}`),
};

export const transactions = {
  list: (params?: any) => api.get('/transactions', { params }),
  create: (data: any) => api.post('/transactions', data),
  confirm: (id: number) => api.put(`/transactions/${id}/confirm`),
  release: (id: number) => api.put(`/transactions/${id}/release`),
  dispute: (id: number, data: any) => api.put(`/transactions/${id}/dispute`, data),
};

export const wallet = {
  get: () => api.get('/wallet'),
  deposit: (data: any) => api.post('/wallet/deposit', data),
  withdraw: (data: any) => api.post('/wallet/withdraw', data),
  history: (params?: any) => api.get('/wallet/history', { params }),
};

export const chat = {
  getMessages: (otherId: number) => api.get(`/chat/${otherId}`),
  getConversations: () => api.get('/chat'),
};

export const notifications = {
  list: () => api.get('/notifications'),
  markRead: (id: number) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
  registerToken: (token: string) => api.post('/notifications/register-token', { token }),
};

export const reviews = {
  create: (data: any) => api.post('/reviews', data),
  getByUser: (userId: number) => api.get(`/reviews/user/${userId}`),
  getByService: (serviceId: number) => api.get(`/reviews/service/${serviceId}`),
};

export const admin = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params?: any) => api.get('/admin/users', { params }),
  updateUser: (id: number, data: any) => api.put(`/admin/users/${id}`, data),
  getServices: (params?: any) => api.get('/admin/services', { params }),
  getTransactions: (params?: any) => api.get('/admin/transactions', { params }),
  updateServiceStatus: (id: number, status: string) => api.put(`/admin/services/${id}/status`, { status }),
};

export default api;
