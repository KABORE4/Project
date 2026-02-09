const express = require('express');
const app = express();

// Middleware pour logger toutes les requêtes
app.use(express.json({ limit: '10mb' }));
app.use((req, res, next) => {
  console.log('\n=== DEBUG REQUEST ===');
  console.log('📅 Time:', new Date().toISOString());
  console.log('🔗 URL:', req.url);
  console.log('📝 Method:', req.method);
  console.log('📋 Headers:', JSON.stringify(req.headers, null, 2));
  console.log('📦 Body:', JSON.stringify(req.body, null, 2));
  console.log('==================\n');
  next();
});

// Endpoint de test pour recevoir les requêtes
app.post('/api/auth/login', (req, res) => {
  console.log('🔐 Login request received');
  res.json({ message: 'Login endpoint debug' });
});

app.post('/api/auth/register', (req, res) => {
  console.log('📝 Register request received');
  res.json({ message: 'Register endpoint debug' });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🐛 Debug server running on port ${PORT}`);
  console.log(`📡 Test endpoints:`);
  console.log(`   POST http://localhost:${PORT}/api/auth/login`);
  console.log(`   POST http://localhost:${PORT}/api/auth/register`);
});
