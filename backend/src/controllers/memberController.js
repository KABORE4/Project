const { Member } = require('../models');
const { sequelize } = require('../config/database');
const { Op } = require('sequelize');

// Get all members
exports.getAllMembers = async (req, res) => {
  try {
    const members = await Member.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json({
      success: true,
      count: members.length,
      data: members
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single member
exports.getMember = async (req, res) => {
  try {
    const member = await Member.findByPk(req.params.id, {
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

// Create member
exports.createMember = async (req, res) => {
  try {
    const { name, email, phone, village, plotSize, password, role } = req.body;

    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Name is required'
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    if (!phone || !phone.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Phone is required'
      });
    }

    if (!village || !village.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Village is required'
      });
    }

    if (!plotSize || parseFloat(plotSize) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Plot size must be greater than 0'
      });
    }

    if (!password || !password.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Password is required'
      });
    }

    // Check if email already exists
    const existingMember = await Member.findOne({ where: { email } });
    if (existingMember) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }

    const member = await Member.create({
      name,
      email,
      phone,
      village,
      plotSize,
      password,
      role: role || 'member'
    });

    res.status(201).json({
      success: true,
      message: 'Member created successfully',
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

// Update member
exports.updateMember = async (req, res) => {
  try {
    const { name, phone, village, plotSize, status, shares } = req.body;

    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Name is required'
      });
    }

    if (!phone || !phone.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Phone is required'
      });
    }

    if (!village || !village.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Village is required'
      });
    }

    if (!plotSize || parseFloat(plotSize) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Plot size must be greater than 0'
      });
    }

    const member = await Member.findByPk(req.params.id);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    await member.update({ name, phone, village, plotSize, status, shares });

    res.status(200).json({
      success: true,
      message: 'Member updated successfully',
      data: member
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Delete member
exports.deleteMember = async (req, res) => {
  try {
    const member = await Member.findByPk(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    await member.destroy();

    res.status(200).json({
      success: true,
      message: 'Member deleted successfully',
      data: { id: member.id }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get member statistics
exports.getMemberStats = async (req, res) => {
  try {
    const totalMembers = await Member.count();
    const activeMembers = await Member.count({ where: { status: 'active' } });
    const inactiveMembers = await Member.count({ where: { status: 'inactive' } });
    const membersByRole = await Member.findAll({
      attributes: ['role', [require('sequelize').fn('count', require('sequelize').col('id')), 'count']],
      group: ['role'],
      raw: true
    });

    res.status(200).json({
      success: true,
      data: {
        totalMembers,
        activeMembers,
        inactiveMembers,
        membersByRole
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
