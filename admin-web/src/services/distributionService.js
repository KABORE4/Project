import api from './api.js';

export const getDistributions = async () => {
  const response = await api.get('/distributions');
  const data = response.data.data;
  // Clean data to avoid XrayWrapper issues
  return data ? JSON.parse(JSON.stringify(data)) : [];
};

export const getDistribution = async (id) => {
  const response = await api.get(`/distributions/${id}`);
  const data = response.data.data;
  // Clean data to avoid XrayWrapper issues
  return data ? JSON.parse(JSON.stringify(data)) : null;
};

export const createDistribution = async (distributionData) => {
  const response = await api.post('/distributions', distributionData);
  const data = response.data.data;
  // Clean data to avoid XrayWrapper issues
  return data ? JSON.parse(JSON.stringify(data)) : null;
};

export const updateDistribution = async (id, distributionData) => {
  const response = await api.put(`/distributions/${id}`, distributionData);
  const data = response.data.data;
  // Clean data to avoid XrayWrapper issues
  return data ? JSON.parse(JSON.stringify(data)) : null;
};

export const approveDistribution = async (id) => {
  const response = await api.post(`/distributions/${id}/approve`);
  const data = response.data.data;
  // Clean data to avoid XrayWrapper issues
  return data ? JSON.parse(JSON.stringify(data)) : null;
};

export const recordMemberPayment = async (id, paymentData) => {
  const response = await api.post(`/distributions/${id}/payment`, paymentData);
  const data = response.data.data;
  // Clean data to avoid XrayWrapper issues
  return data ? JSON.parse(JSON.stringify(data)) : null;
};

export const deleteDistribution = async (id) => {
  const response = await api.delete(`/distributions/${id}`);
  const data = response.data.data;
  // Clean data to avoid XrayWrapper issues
  return data ? JSON.parse(JSON.stringify(data)) : null;
};

export const getMemberDistributions = async (memberId) => {
  const response = await api.get(`/distributions/member/${memberId}`);
  const data = response.data.data;
  // Clean data to avoid XrayWrapper issues
  return data ? JSON.parse(JSON.stringify(data)) : [];
};
