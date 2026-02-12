import api from './api.js';

export const getHarvests = async () => {
  const response = await api.get('/harvests');
  const data = response.data.data;
  // Clean data to avoid XrayWrapper issues
  return data ? JSON.parse(JSON.stringify(data)) : [];
};

export const getHarvest = async (id) => {
  const response = await api.get(`/harvests/${id}`);
  const data = response.data.data;
  // Clean data to avoid XrayWrapper issues
  return data ? JSON.parse(JSON.stringify(data)) : null;
};

export const createHarvest = async (harvestData) => {
  const response = await api.post('/harvests', harvestData);
  const data = response.data.data;
  // Clean data to avoid XrayWrapper issues
  return data ? JSON.parse(JSON.stringify(data)) : null;
};

export const updateHarvest = async (id, harvestData) => {
  const response = await api.put(`/harvests/${id}`, harvestData);
  const data = response.data.data;
  // Clean data to avoid XrayWrapper issues
  return data ? JSON.parse(JSON.stringify(data)) : null;
};

export const validateHarvest = async (id) => {
  const response = await api.post(`/harvests/${id}/validate`);
  const data = response.data.data;
  // Clean data to avoid XrayWrapper issues
  return data ? JSON.parse(JSON.stringify(data)) : null;
};

export const deleteHarvest = async (id) => {
  const response = await api.delete(`/harvests/${id}`);
  const data = response.data.data;
  // Clean data to avoid XrayWrapper issues
  return data ? JSON.parse(JSON.stringify(data)) : null;
};

export const getHarvestsByMember = async (memberId) => {
  const response = await api.get(`/harvests/member/${memberId}`);
  const data = response.data.data;
  // Clean data to avoid XrayWrapper issues
  return data ? JSON.parse(JSON.stringify(data)) : [];
};
