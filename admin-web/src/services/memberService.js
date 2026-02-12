import api from './api.js';

export const getMembers = async () => {
  const response = await api.get('/members');
  const data = response.data.data;
  // Clean data to avoid XrayWrapper issues
  return data ? JSON.parse(JSON.stringify(data)) : [];
};

export const getMember = async (id) => {
  const response = await api.get(`/members/${id}`);
  const data = response.data.data;
  // Clean data to avoid XrayWrapper issues
  return data ? JSON.parse(JSON.stringify(data)) : null;
};

export const createMember = async (memberData) => {
  const response = await api.post('/members', memberData);
  const data = response.data.data;
  // Clean data to avoid XrayWrapper issues
  return data ? JSON.parse(JSON.stringify(data)) : null;
};

export const updateMember = async (id, memberData) => {
  const response = await api.put(`/members/${id}`, memberData);
  const data = response.data.data;
  // Clean data to avoid XrayWrapper issues
  return data ? JSON.parse(JSON.stringify(data)) : null;
};

export const deleteMember = async (id) => {
  const response = await api.delete(`/members/${id}`);
  const data = response.data.data;
  // Clean data to avoid XrayWrapper issues
  return data ? JSON.parse(JSON.stringify(data)) : null;
};
