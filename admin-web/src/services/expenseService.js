import api from './api.js';

export const getExpenses = async () => {
  const response = await api.get('/expenses');
  return response.data.data;
};

export const getExpense = async (id) => {
  const response = await api.get(`/expenses/${id}`);
  return response.data.data;
};

export const createExpense = async (expenseData) => {
  const response = await api.post('/expenses', expenseData);
  return response.data.data;
};

export const updateExpense = async (id, expenseData) => {
  const response = await api.put(`/expenses/${id}`, expenseData);
  return response.data.data;
};

export const recordPayment = async (id, paymentData) => {
  const response = await api.post(`/expenses/${id}/payment`, paymentData);
  return response.data.data;
};

export const deleteExpense = async (id) => {
  const response = await api.delete(`/expenses/${id}`);
  return response.data.data;
};

export const getMemberExpenses = async (memberId) => {
  const response = await api.get(`/expenses/member/${memberId}`);
  return response.data.data;
};
