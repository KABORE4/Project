import api from './api.js';

export const getBookings = async () => {
  const response = await api.get('/bookings');
  return response.data.data;
};

export const getBooking = async (id) => {
  const response = await api.get(`/bookings/${id}`);
  return response.data.data;
};

export const createBooking = async (bookingData) => {
  const response = await api.post('/bookings', bookingData);
  return response.data.data;
};

export const updateBooking = async (id, bookingData) => {
  const response = await api.put(`/bookings/${id}`, bookingData);
  return response.data.data;
};

export const confirmBooking = async (id) => {
  const response = await api.post(`/bookings/${id}/confirm`);
  return response.data.data;
};

export const deleteBooking = async (id) => {
  const response = await api.delete(`/bookings/${id}`);
  return response.data.data;
};

export const getMemberBookings = async (memberId) => {
  const response = await api.get(`/bookings/member/${memberId}`);
  return response.data.data;
};
