const { Sequelize } = require('sequelize');
require('dotenv').config();
const bcrypt = require('bcryptjs');

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

async function createFinalTestUser() {
  try {
    // Supprimer tous les utilisateurs avec cet email
    const deletedCount = await Member.destroy({ 
      where: { email: 'test@example.com' } 
    });
    console.log(`🗑️ ${deletedCount} utilisateur(s) supprimé(s)`);

    // Créer un hash qui fonctionne
    const hashedPassword = await bcrypt.hash('password123', 10);
    console.log('🔑 Hash créé:', hashedPassword);
    
    // Vérifier que le hash fonctionne
    const isValid = await bcrypt.compare('password123', hashedPassword);
    console.log('✅ Hash validé:', isValid ? 'OUI' : 'NON');
    
    // Créer l'utilisateur
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

    console.log('\n✅ Utilisateur final créé:');
    console.log('📧 Email: test@example.com');
    console.log('🔑 Mot de passe: password123');
    console.log('🆔 ID:', testUser.id);
    console.log('🔑 Hash final:', hashedPassword);
    
    // Test final
    const finalTest = await bcrypt.compare('password123', testUser.password);
    console.log('🧪 Test final:', finalTest ? '✅ SUCCÈS' : '❌ ÉCHEC');
    
    await sequelize.close();
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

createFinalTestUser();
