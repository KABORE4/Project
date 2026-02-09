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

async function checkUser() {
  try {
    const user = await Member.findOne({ where: { email: 'test@example.com' } });
    
    if (user) {
      console.log('✅ Utilisateur trouvé:');
      console.log('📧 Email:', user.email);
      console.log('👤 Nom:', user.name);
      console.log('🔑 Hash:', user.password);
      console.log('🆔 ID:', user.id);
    } else {
      console.log('❌ Utilisateur non trouvé');
    }
    
    await sequelize.close();
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

checkUser();
