const bcrypt = require('bcrypt');
const { Sequelize } = require('sequelize');
require('dotenv').config();

// Import models
const Member = require('./src/models/Member');

// Create test user
async function createTestUser() {
  try {
    // Connect to database
    const sequelize = new Sequelize(
      process.env.DB_NAME || 'farming_coop',
      process.env.DB_USER || 'postgres',
      process.env.DB_PASSWORD || '1234',
      {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        dialect: process.env.DB_DIALECT || 'postgres',
        logging: false,
      }
    );

    // Hash password
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Check if user already exists
    const existingUser = await Member.findOne({ where: { email: 'test@example.com' } });
    
    if (existingUser) {
      console.log('Deleting existing test user...');
      await existingUser.destroy();
    }

    // Create test user
    const testUser = await Member.create({
      name: 'Test Farmer',
      email: 'test@example.com',
      phone: '+1234567890',
      village: 'Test Village',
      plotSize: 5.0,
      password: hashedPassword,
      role: 'member',
      status: 'active'
    });

    console.log('Test user created successfully:');
    console.log('Email: test@example.com');
    console.log('Password: password123');
    console.log('User ID:', testUser.id);

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('Error creating test user:', error);
    process.exit(1);
  }
}

createTestUser();
