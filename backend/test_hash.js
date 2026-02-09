const bcrypt = require('bcryptjs');

async function testHash() {
  const password = 'password123';
  
  console.log('🔑 Test de hash avec bcryptjs...');
  
  // Test avec 10 rounds
  const hash1 = await bcrypt.hash(password, 10);
  console.log('Hash 1 (10 rounds):', hash1);
  
  const isValid1 = await bcrypt.compare(password, hash1);
  console.log('Validation 1:', isValid1 ? '✅ CORRECT' : '❌ INCORRECT');
  
  // Test avec 12 rounds
  const hash2 = await bcrypt.hash(password, 12);
  console.log('Hash 2 (12 rounds):', hash2);
  
  const isValid2 = await bcrypt.compare(password, hash2);
  console.log('Validation 2:', isValid2 ? '✅ CORRECT' : '❌ INCORRECT');
  
  // Test direct
  console.log('\n🧪 Test direct:');
  const testHash = '$2a$10$N9qo8uLOickgx2ZMRZoMy.MrqJ3h9V9C6cBkqQeUjEeQqJ5M5J5K6';
  const isValid3 = await bcrypt.compare(password, testHash);
  console.log('Test avec hash connu:', isValid3 ? '✅ CORRECT' : '❌ INCORRECT');
}

testHash().catch(console.error);
