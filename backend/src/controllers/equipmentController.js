const { Equipment } = require('../models');
const { sequelize } = require('../config/database');

// Get all equipment
exports.getAllEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findAll();
    res.status(200).json({
      success: true,
      count: equipment.length,
      data: equipment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get available equipment
exports.getAvailableEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findAll({ where: { status: 'available' } });
    res.status(200).json({
      success: true,
      count: equipment.length,
      data: equipment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single equipment
exports.getEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findByPk(req.params.id);
    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: 'Equipment not found'
      });
    }
    res.status(200).json({
      success: true,
      data: equipment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create equipment
exports.createEquipment = async (req, res) => {
  try {
    const {
      equipmentCode,
      name,
      type,
      description,
      purchaseDate,
      purchasePrice,
      rentalRate,
      rentalUnit,
      location,
      ownershipType
    } = req.body;

    const equipment = await Equipment.create({
      equipmentCode,
      name,
      type,
      description,
      purchaseDate,
      purchasePrice,
      currentValue: purchasePrice,
      rentalRate,
      rentalUnit: rentalUnit || 'per-day',
      location,
      ownershipType: ownershipType || 'cooperative'
    });

    res.status(201).json({
      success: true,
      message: 'Equipment added successfully',
      data: equipment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Update equipment
exports.updateEquipment = async (req, res) => {
  try {
    const { name, status, rentalRate, currentValue, location, maintenanceSchedule } = req.body;

    const equipment = await Equipment.findByPk(req.params.id);

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: 'Equipment not found'
      });
    }

    await equipment.update({ name, status, rentalRate, currentValue, location, maintenanceSchedule });

    res.status(200).json({
      success: true,
      message: 'Equipment updated successfully',
      data: equipment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Delete equipment
exports.deleteEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findByPk(req.params.id);

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: 'Equipment not found'
      });
    }

    const equipmentId = equipment.id;
    await equipment.destroy();

    res.status(200).json({
      success: true,
      message: 'Equipment deleted successfully',
      data: { id: equipmentId }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get equipment statistics
exports.getEquipmentStats = async (req, res) => {
  try {
    const totalEquipment = await Equipment.count();
    const equipmentByStatus = await Equipment.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['status'],
      raw: true
    });
    const equipmentByType = await Equipment.findAll({
      attributes: [
        'type',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['type'],
      raw: true
    });

    res.status(200).json({
      success: true,
      data: {
        totalEquipment,
        equipmentByStatus,
        equipmentByType
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
