import api from './api.js';

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const verify2FA = async (email, code) => {
  const response = await api.post('/auth/verify-2fa', { email, code });
  return response.data;
};

export const enable2FA = async (token) => {
  const response = await api.post('/auth/enable-2fa', {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const disable2FA = async (token) => {
  const response = await api.post('/auth/disable-2fa', {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const get2FAStatus = async (token) => {
  const response = await api.get('/auth/2fa-status', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const refreshToken = async (refreshToken) => {
  const response = await api.post('/auth/refresh-token', { refreshToken });
  return response.data;
};
