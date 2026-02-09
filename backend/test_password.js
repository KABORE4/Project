const bcrypt = require('bcryptjs');
const password = 'password123';
const hashedPassword = '$2a$10$eimBF/dwXYIlpsmoIyyXk.n062d599AmZ5RfDYEdVpwyZOLnzm7MO';

bcrypt.compare(password, hashedPassword, (err, isMatch) => {
  if (err) {
    console.log('❌ Erreur:', err.message);
  } else if (isMatch) {
    console.log('✅ Mot de passe CORRECT!');
  } else {
    console.log('❌ Mot de passe INCORRECT');
  }
});
