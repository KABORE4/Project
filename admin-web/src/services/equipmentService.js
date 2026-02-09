import api from './api.js';

export const getEquipment = async () => {
  const response = await api.get('/equipment');
  return response.data.data;
};

export const getEquipmentItem = async (id) => {
  const response = await api.get(`/equipment/${id}`);
  return response.data.data;
};

export const createEquipment = async (equipmentData) => {
  const response = await api.post('/equipment', equipmentData);
  return response.data.data;
};

export const updateEquipment = async (id, equipmentData) => {
  const response = await api.put(`/equipment/${id}`, equipmentData);
  return response.data.data;
};

export const deleteEquipment = async (id) => {
  const response = await api.delete(`/equipment/${id}`);
  return response.data.data;
};

export const getAvailableEquipment = async () => {
  const response = await api.get('/equipment/available');
  return response.data.data;
};
