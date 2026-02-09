import api from './api.js';

export const getDistributions = async () => {
  const response = await api.get('/distributions');
  return response.data.data;
};

export const getDistribution = async (id) => {
  const response = await api.get(`/distributions/${id}`);
  return response.data.data;
};

export const createDistribution = async (distributionData) => {
  const response = await api.post('/distributions', distributionData);
  return response.data.data;
};

export const updateDistribution = async (id, distributionData) => {
  const response = await api.put(`/distributions/${id}`, distributionData);
  return response.data.data;
};

export const approveDistribution = async (id) => {
  const response = await api.post(`/distributions/${id}/approve`);
  return response.data.data;
};

export const recordMemberPayment = async (id, paymentData) => {
  const response = await api.post(`/distributions/${id}/payment`, paymentData);
  return response.data.data;
};

export const deleteDistribution = async (id) => {
  const response = await api.delete(`/distributions/${id}`);
  return response.data.data;
};

export const getMemberDistributions = async (memberId) => {
  const response = await api.get(`/distributions/member/${memberId}`);
  return response.data.data;
};
