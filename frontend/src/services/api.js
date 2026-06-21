import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);

// Items
export const getAllItems = () => API.get('/items');
export const getItemById = (id) => API.get(`/items/${id}`);
export const postItem = (data) => API.post('/items', data);
export const deleteItem = (id) => API.delete(`/items/${id}`);
export const getItemsByStatus = (status) => API.get(`/items/status/${status}`);

// Claims
export const createClaim = (itemId, message) => API.post(`/claims/${itemId}`, null, { params: { message } });
export const getAllClaims = () => API.get('/claims');
export const updateClaimStatus = (claimId, status) => API.put(`/claims/${claimId}/status?status=${status}`);
export const contactSupport = (data) => axios.post('http://localhost:8080/api/support/contact', data);

// Exchange & Reviews
export const getExchangePartner = (itemId) => API.get(`/items/${itemId}/exchange-partner`);
export const giveReview = (data) => axios.post('http://localhost:8080/api/reviews/give', data);