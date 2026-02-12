import api from './api.js';

export const getPlots = async () => {
  const response = await api.get('/plots');
  const data = response.data.data;
  // Clean data to avoid XrayWrapper issues
  return data ? JSON.parse(JSON.stringify(data)) : [];
};

export const getPlot = async (id) => {
  const response = await api.get(`/plots/${id}`);
  const data = response.data.data;
  // Clean data to avoid XrayWrapper issues
  return data ? JSON.parse(JSON.stringify(data)) : null;
};

export const createPlot = async (plotData) => {
  const response = await api.post('/plots', plotData);
  const data = response.data.data;
  // Clean data to avoid XrayWrapper issues
  return data ? JSON.parse(JSON.stringify(data)) : null;
};

export const updatePlot = async (id, plotData) => {
  const response = await api.put(`/plots/${id}`, plotData);
  const data = response.data.data;
  // Clean data to avoid XrayWrapper issues
  return data ? JSON.parse(JSON.stringify(data)) : null;
};

export const deletePlot = async (id) => {
  const response = await api.delete(`/plots/${id}`);
  const data = response.data.data;
  // Clean data to avoid XrayWrapper issues
  return data ? JSON.parse(JSON.stringify(data)) : null;
};

export const getPlotsByMember = async (memberId) => {
  const response = await api.get(`/plots/member/${memberId}`);
  const data = response.data.data;
  // Clean data to avoid XrayWrapper issues
  return data ? JSON.parse(JSON.stringify(data)) : [];
};
