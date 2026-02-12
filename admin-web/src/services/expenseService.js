import api from './api.js';

export const getExpenses = async () => {
  const response = await api.get('/expenses');
  const data = response.data.data;
  // Clean data to avoid XrayWrapper issues
  return data ? JSON.parse(JSON.stringify(data)) : [];
};

export const getExpense = async (id) => {
  const response = await api.get(`/expenses/${id}`);
  const data = response.data.data;
  // Clean data to avoid XrayWrapper issues
  return data ? JSON.parse(JSON.stringify(data)) : null;
};

export const createExpense = async (expenseData) => {
  const response = await api.post('/expenses', expenseData);
  const data = response.data.data;
  // Clean data to avoid XrayWrapper issues
  return data ? JSON.parse(JSON.stringify(data)) : null;
};

export const updateExpense = async (id, expenseData) => {
  const response = await api.put(`/expenses/${id}`, expenseData);
  const data = response.data.data;
  // Clean data to avoid XrayWrapper issues
  return data ? JSON.parse(JSON.stringify(data)) : null;
};

export const recordPayment = async (id, paymentData) => {
  const response = await api.post(`/expenses/${id}/payment`, paymentData);
  const data = response.data.data;
  // Clean data to avoid XrayWrapper issues
  return data ? JSON.parse(JSON.stringify(data)) : null;
};

export const deleteExpense = async (id) => {
  const response = await api.delete(`/expenses/${id}`);
  const data = response.data.data;
  // Clean data to avoid XrayWrapper issues
  return data ? JSON.parse(JSON.stringify(data)) : null;
};

export const getMemberExpenses = async (memberId) => {
  const response = await api.get(`/expenses/member/${memberId}`);
  const data = response.data.data;
  // Clean data to avoid XrayWrapper issues
  return data ? JSON.parse(JSON.stringify(data)) : [];
};
