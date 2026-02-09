import api from './api.js';

export const getSales = async () => {
  const response = await api.get('/sales');
  return response.data.data;
};

export const getSale = async (id) => {
  const response = await api.get(`/sales/${id}`);
  return response.data.data;
};

export const createSale = async (saleData) => {
  const response = await api.post('/sales', saleData);
  return response.data.data;
};

export const updateSale = async (id, saleData) => {
  const response = await api.put(`/sales/${id}`, saleData);
  return response.data.data;
};

export const recordPayment = async (id, paymentData) => {
  const response = await api.post(`/sales/${id}/payment`, paymentData);
  return response.data.data;
};

export const deleteSale = async (id) => {
  const response = await api.delete(`/sales/${id}`);
  return response.data.data;
};

export const getSalesByMember = async (memberId) => {
  const response = await api.get(`/sales/member/${memberId}`);
  return response.data.data;
};
