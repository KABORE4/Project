const { Sequelize } = require('sequelize');
require('dotenv').config();

// Import models
const Member = require('./src/models/Member');

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

async function cleanAndCreateUser() {
  try {
    // Supprimer tous les utilisateurs avec cet email
    const deletedCount = await Member.destroy({ 
      where: { email: 'test@example.com' } 
    });
    console.log(`🗑️ ${deletedCount} utilisateur(s) supprimé(s)`);

    // Créer un nouvel utilisateur avec un hash frais
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('password123', 10);
    
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

    console.log('✅ Nouvel utilisateur créé:');
    console.log('📧 Email: test@example.com');
    console.log('🔑 Mot de passe: password123');
    console.log('🆔 ID:', testUser.id);
    console.log('🔑 Hash:', hashedPassword);
    
    await sequelize.close();
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

cleanAndCreateUser();
