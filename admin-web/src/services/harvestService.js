import api from './api.js';

export const getHarvests = async () => {
  const response = await api.get('/harvests');
  return response.data.data;
};

export const getHarvest = async (id) => {
  const response = await api.get(`/harvests/${id}`);
  return response.data.data;
};

export const createHarvest = async (harvestData) => {
  const response = await api.post('/harvests', harvestData);
  return response.data.data;
};

export const updateHarvest = async (id, harvestData) => {
  const response = await api.put(`/harvests/${id}`, harvestData);
  return response.data.data;
};

export const validateHarvest = async (id) => {
  const response = await api.post(`/harvests/${id}/validate`);
  return response.data.data;
};

export const deleteHarvest = async (id) => {
  const response = await api.delete(`/harvests/${id}`);
  return response.data.data;
};

export const getHarvestsByMember = async (memberId) => {
  const response = await api.get(`/harvests/member/${memberId}`);
  return response.data.data;
};
