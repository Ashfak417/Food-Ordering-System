import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle auth errors globally
API.interceptors.response.use(
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

// ─── Auth ───────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
  updateProfile: (data) => API.put('/auth/update-profile', data),
  changePassword: (data) => API.put('/auth/change-password', data),
};

// ─── Food ────────────────────────────────────────────────────────────────────
export const foodAPI = {
  getAll: (params) => API.get('/food', { params }),
  getOne: (id) => API.get(`/food/${id}`),
  create: (data) => API.post('/food', data),
  update: (id, data) => API.put(`/food/${id}`, data),
  delete: (id) => API.delete(`/food/${id}`),
  toggleAvailability: (id) => API.patch(`/food/${id}/toggle-availability`),
};

// ─── Orders ──────────────────────────────────────────────────────────────────
export const orderAPI = {
  place: (data) => API.post('/orders', data),
  getMyOrders: () => API.get('/orders/my-orders'),
  getOne: (id) => API.get(`/orders/${id}`),
  cancel: (id) => API.patch(`/orders/${id}/cancel`),
};

// ─── Payment ─────────────────────────────────────────────────────────────────
export const paymentAPI = {
  initiate: (orderId) => API.post('/payment/initiate', { orderId }),
  verify: (orderId) => API.get(`/payment/verify/${orderId}`),
};

// ─── Admin ───────────────────────────────────────────────────────────────────
export const adminAPI = {
  getDashboard: () => API.get('/admin/dashboard'),
  getCustomers: (params) => API.get('/admin/customers', { params }),
  getCustomer: (id) => API.get(`/admin/customers/${id}`),
  toggleCustomerStatus: (id) => API.patch(`/admin/customers/${id}/toggle-status`),
  getOrders: (params) => API.get('/admin/orders', { params }),
  updateOrderStatus: (id, orderStatus) => API.patch(`/admin/orders/${id}/status`, { orderStatus }),
};

export default API;
