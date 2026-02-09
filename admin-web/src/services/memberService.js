import api from './api.js';

export const getMembers = async () => {
  const response = await api.get('/members');
  return response.data.data;
};

export const getMember = async (id) => {
  const response = await api.get(`/members/${id}`);
  return response.data.data;
};

export const createMember = async (memberData) => {
  const response = await api.post('/members', memberData);
  return response.data.data;
};

export const updateMember = async (id, memberData) => {
  const response = await api.put(`/members/${id}`, memberData);
  return response.data.data;
};

export const deleteMember = async (id) => {
  const response = await api.delete(`/members/${id}`);
  return response.data.data;
};
