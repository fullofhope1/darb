import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const auth = {
  register: (data) => api.post('/auth/register', data).then((r) => r.data),
  login: (data) => api.post('/auth/login', data).then((r) => r.data),
  sendOtp: (phone) => api.post('/auth/send-otp', { phone }).then((r) => r.data),
  verifyOtp: (phone, code) => api.post('/auth/verify-otp', { phone, code }).then((r) => r.data),
  profile: () => api.get('/auth/profile').then((r) => r.data),
  updateProfile: (data) => api.put('/auth/profile', data).then((r) => r.data),
};

export const categories = {
  list: () => api.get('/categories').then((r) => r.data),
  get: (id) => api.get(`/categories/${id}`).then((r) => r.data),
};

export const services = {
  list: (params) => api.get('/services', { params }).then((r) => r.data),
  my: () => api.get('/services/my').then((r) => r.data),
  get: (id) => api.get(`/services/${id}`).then((r) => r.data),
  add: (data) => api.post('/services', data).then((r) => r.data),
  update: (id, data) => api.put(`/services/${id}`, data).then((r) => r.data),
  delete: (id) => api.delete(`/services/${id}`).then((r) => r.data),
};

export const requests = {
  list: (params) => api.get('/requests', { params }).then((r) => r.data),
  my: () => api.get('/requests/my').then((r) => r.data),
  get: (id) => api.get(`/requests/${id}`).then((r) => r.data),
  add: (data) => api.post('/requests', data).then((r) => r.data),
  update: (id, data) => api.put(`/requests/${id}`, data).then((r) => r.data),
  delete: (id) => api.delete(`/requests/${id}`).then((r) => r.data),
};

export const offers = {
  list: (requestId) => api.get(`/offers/${requestId}`).then((r) => r.data),
  create: (requestId, data) => api.post(`/offers/${requestId}`, data).then((r) => r.data),
  accept: (id) => api.post(`/offers/${id}/accept`).then((r) => r.data),
};

export const transactions = {
  list: () => api.get('/transactions').then((r) => r.data),
  create: (data) => api.post('/transactions', data).then((r) => r.data),
  pay: (id) => api.post(`/transactions/${id}/pay`).then((r) => r.data),
  deliver: (id) => api.post(`/transactions/${id}/deliver`).then((r) => r.data),
  confirm: (id) => api.post(`/transactions/${id}/confirm`).then((r) => r.data),
};

export const wallet = {
  get: () => api.get('/wallet').then((r) => r.data),
  transactions: () => api.get('/wallet/transactions').then((r) => r.data),
  withdrawals: () => api.get('/wallet/withdrawals').then((r) => r.data),
  withdraw: (data) => api.post('/wallet/withdrawals', data).then((r) => r.data),
};

export const reviews = {
  create: (data) => api.post('/reviews', data).then((r) => r.data),
  getUser: (userId) => api.get(`/reviews/${userId}`).then((r) => r.data),
};

export const notifications = {
  list: () => api.get('/notifications').then((r) => r.data),
  markRead: (id) => api.put(`/notifications/${id}/read`).then((r) => r.data),
  markAllRead: () => api.put('/notifications/read-all').then((r) => r.data),
};

export const upload = {
  images: (files) => {
    const fd = new FormData();
    Array.from(files).forEach((f) => fd.append('images', f));
    return api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data);
  },
};

export const search = {
  all: (params) => api.get('/search', { params }).then((r) => r.data),
};

export const admin = {
  dashboard: () => api.get('/admin/dashboard').then((r) => r.data),
  users: () => api.get('/admin/users').then((r) => r.data),
  updateUserStatus: (id, status) => api.put(`/admin/users/${id}/status`, { status }).then((r) => r.data),
  transactions: () => api.get('/admin/transactions').then((r) => r.data),
  withdrawals: () => api.get('/admin/withdrawals').then((r) => r.data),
  updateWithdrawal: (id, data) => api.put(`/admin/withdrawals/${id}`, data).then((r) => r.data),
  disputes: () => api.get('/admin/disputes').then((r) => r.data),
  resolveDispute: (id, data) => api.post(`/admin/disputes/${id}/resolve`, data).then((r) => r.data),
};
