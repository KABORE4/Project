import api from './api.js';

export const getSales = async () => {
  const response = await api.get('/sales');
  const data = response.data.data;
  // Clean data to avoid XrayWrapper issues
  return data ? JSON.parse(JSON.stringify(data)) : [];
};

export const getSale = async (id) => {
  const response = await api.get(`/sales/${id}`);
  const data = response.data.data;
  // Clean data to avoid XrayWrapper issues
  return data ? JSON.parse(JSON.stringify(data)) : null;
};

export const createSale = async (saleData) => {
  const response = await api.post('/sales', saleData);
  const data = response.data.data;
  // Clean data to avoid XrayWrapper issues
  return data ? JSON.parse(JSON.stringify(data)) : null;
};

export const updateSale = async (id, saleData) => {
  const response = await api.put(`/sales/${id}`, saleData);
  const data = response.data.data;
  // Clean data to avoid XrayWrapper issues
  return data ? JSON.parse(JSON.stringify(data)) : null;
};

export const recordPayment = async (id, paymentData) => {
  const response = await api.post(`/sales/${id}/payment`, paymentData);
  const data = response.data.data;
  // Clean data to avoid XrayWrapper issues
  return data ? JSON.parse(JSON.stringify(data)) : null;
};

export const deleteSale = async (id) => {
  const response = await api.delete(`/sales/${id}`);
  const data = response.data.data;
  // Clean data to avoid XrayWrapper issues
  return data ? JSON.parse(JSON.stringify(data)) : null;
};

export const getSalesByMember = async (memberId) => {
  const response = await api.get(`/sales/member/${memberId}`);
  const data = response.data.data;
  // Clean data to avoid XrayWrapper issues
  return data ? JSON.parse(JSON.stringify(data)) : [];
};
