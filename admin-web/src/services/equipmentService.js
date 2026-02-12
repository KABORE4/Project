import api from './api.js';

export const getEquipment = async () => {
  const response = await api.get('/equipment');
  const data = response.data.data;
  // Clean data to avoid XrayWrapper issues
  return data ? JSON.parse(JSON.stringify(data)) : [];
};

export const getEquipmentItem = async (id) => {
  const response = await api.get(`/equipment/${id}`);
  const data = response.data.data;
  // Clean data to avoid XrayWrapper issues
  return data ? JSON.parse(JSON.stringify(data)) : null;
};

export const createEquipment = async (equipmentData) => {
  const response = await api.post('/equipment', equipmentData);
  const data = response.data.data;
  // Clean data to avoid XrayWrapper issues
  return data ? JSON.parse(JSON.stringify(data)) : null;
};

export const updateEquipment = async (id, equipmentData) => {
  const response = await api.put(`/equipment/${id}`, equipmentData);
  const data = response.data.data;
  // Clean data to avoid XrayWrapper issues
  return data ? JSON.parse(JSON.stringify(data)) : null;
};

export const deleteEquipment = async (id) => {
  const response = await api.delete(`/equipment/${id}`);
  const data = response.data.data;
  // Clean data to avoid XrayWrapper issues
  return data ? JSON.parse(JSON.stringify(data)) : null;
};

export const getAvailableEquipment = async () => {
  const response = await api.get('/equipment/available');
  const data = response.data.data;
  // Clean data to avoid XrayWrapper issues
  return data ? JSON.parse(JSON.stringify(data)) : [];
};
