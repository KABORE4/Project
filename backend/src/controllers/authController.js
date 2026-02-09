const jwt = require('jsonwebtoken');
const Member = require('../models/Member');

// Generate JWT token
const generateToken = (member) => {
  console.log('\n🔑 JWT DEBUG:');
  console.log('📝 JWT_SECRET:', process.env.JWT_SECRET ? 'Défini' : 'NON DÉFINI');
  console.log('⏰ JWT_EXPIRE:', process.env.JWT_EXPIRE || '7d');
  console.log('👤 Member data:', { id: member.id, email: member.email, role: member.role });
  
  return jwt.sign(
    { id: member.id, email: member.email, role: member.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// Register new member
exports.register = async (req, res) => {
  try {
    const { name, email, phone, village, plotSize, password, role } = req.body;

    // Check if email already exists
    const existingMember = await Member.findOne({ where: { email } });
    if (existingMember) {
      return res.status(400).json({
        success: false,
        message: 'Email already in use'
      });
    }

    // Create new member
    const member = await Member.create({
      name,
      email,
      phone,
      village,
      plotSize,
      password,
      role: role || 'member'
    });

    // Generate token
    const token = generateToken(member);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      data: {
        id: member.id,
        name: member.name,
        email: member.email,
        role: member.role
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Login member
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('\n🔍 LOGIN DEBUG:');
    console.log('📧 Email reçu:', email);
    console.log('🔑 Password reçu:', password ? '***' : 'undefined');

    if (!email || !password) {
      console.log('❌ Champs manquants');
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find member
    const member = await Member.findOne({ where: { email } });
    console.log('👤 Utilisateur trouvé:', member ? 'OUI' : 'NON');
    
    if (!member) {
      console.log('❌ Utilisateur non trouvé');
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    console.log('📊 Status utilisateur:', member.status);
    console.log('🔑 Hash stocké:', member.password.substring(0, 20) + '...');

    // Compare password
    const isPasswordValid = await member.comparePassword(password);
    console.log('🔐 Mot de passe valide:', isPasswordValid ? 'OUI' : 'NON');
    
    if (!isPasswordValid) {
      console.log('❌ Mot de passe invalide');
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if member is active
    if (member.status !== 'active') {
      console.log('❌ Compte non actif:', member.status);
      return res.status(403).json({
        success: false,
        message: `Your account is ${member.status}. Please contact administrator.`
      });
    }

    console.log('✅ Login réussi pour:', member.name);

    // Generate token
    const token = generateToken(member);

    const response = {
      success: true,
      message: 'Login successful',
      token,
      data: {
        id: member.id,
        name: member.name,
        email: member.email,
        role: member.role,
        village: member.village,
        plotSize: member.plotSize
      }
    };

    console.log('\n📤 RÉPONSE ENVOYÉE:');
    console.log('📦 Response:', JSON.stringify(response, null, 2));

    res.status(200).json(response);
  } catch (error) {
    console.log('💥 ERREUR LOGIN:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get current user profile
exports.getProfile = async (req, res) => {
  try {
    const member = await Member.findByPk(req.userId, {
      attributes: { exclude: ['password'] }
    });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    res.status(200).json({
      success: true,
      data: member
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const member = await Member.findByPk(req.userId);
    
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    // Verify current password
    const isPasswordValid = await member.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    member.password = newPassword;
    await member.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
