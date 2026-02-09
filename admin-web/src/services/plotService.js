import api from './api.js';

export const getPlots = async () => {
  const response = await api.get('/plots');
  return response.data.data;
};

export const getPlot = async (id) => {
  const response = await api.get(`/plots/${id}`);
  return response.data.data;
};

export const createPlot = async (plotData) => {
  const response = await api.post('/plots', plotData);
  return response.data.data;
};

export const updatePlot = async (id, plotData) => {
  const response = await api.put(`/plots/${id}`, plotData);
  return response.data.data;
};

export const deletePlot = async (id) => {
  const response = await api.delete(`/plots/${id}`);
  return response.data.data;
};

export const getPlotsByMember = async (memberId) => {
  const response = await api.get(`/plots/member/${memberId}`);
  return response.data.data;
};
