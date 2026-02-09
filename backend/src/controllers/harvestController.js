const { Harvest, Member, Plot } = require('../models');
const { sequelize } = require('../config/database');

// Get all harvests
exports.getAllHarvests = async (req, res) => {
  try {
    const harvests = await Harvest.findAll({
      include: [
        { model: Member, attributes: ['id', 'name', 'email'] },
        { model: Plot, attributes: ['id', 'plotCode', 'size'] }
      ]
    });
    res.status(200).json({
      success: true,
      count: harvests.length,
      data: harvests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get harvests by member
exports.getHarvestsByMember = async (req, res) => {
  try {
    const harvests = await Harvest.findAll({
      where: { memberId: req.params.memberId },
      include: [{ model: Plot, attributes: ['id', 'plotCode'] }]
    });
    res.status(200).json({
      success: true,
      count: harvests.length,
      data: harvests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single harvest
exports.getHarvest = async (req, res) => {
  try {
    const harvest = await Harvest.findByPk(req.params.id, {
      include: [
        { model: Member, attributes: ['id', 'name', 'email'] },
        { model: Plot }
      ]
    });
    if (!harvest) {
      return res.status(404).json({
        success: false,
        message: 'Harvest not found'
      });
    }
    res.status(200).json({
      success: true,
      data: harvest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create harvest
exports.createHarvest = async (req, res) => {
  try {
    const { harvestCode, memberId, plotId, crop, weight, unit, harvestDate, quality, estimatedValue } = req.body;

    const harvest = await Harvest.create({
      harvestCode,
      memberId,
      plotId,
      crop,
      weight,
      unit: unit || 'kg',
      harvestDate,
      quality: quality || 'good',
      estimatedValue
    });

    res.status(201).json({
      success: true,
      message: 'Harvest recorded successfully',
      data: harvest
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Update harvest
exports.updateHarvest = async (req, res) => {
  try {
    const { weight, quality, status, storageLocation, notes } = req.body;

    const harvest = await Harvest.findByPk(req.params.id);

    if (!harvest) {
      return res.status(404).json({
        success: false,
        message: 'Harvest not found'
      });
    }

    await harvest.update({ weight, quality, status, storageLocation, notes });

    res.status(200).json({
      success: true,
      message: 'Harvest updated successfully',
      data: harvest
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Validate harvest
exports.validateHarvest = async (req, res) => {
  try {
    const { validatedBy } = req.body;

    const harvest = await Harvest.findByPk(req.params.id);

    if (!harvest) {
      return res.status(404).json({
        success: false,
        message: 'Harvest not found'
      });
    }

    await harvest.update({
      status: 'validated',
      validatedBy,
      validationDate: new Date()
    });

    res.status(200).json({
      success: true,
      message: 'Harvest validated successfully',
      data: harvest
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Delete harvest
exports.deleteHarvest = async (req, res) => {
  try {
    const harvest = await Harvest.findByPk(req.params.id);

    if (!harvest) {
      return res.status(404).json({
        success: false,
        message: 'Harvest not found'
      });
    }

    const harvestId = harvest.id;
    await harvest.destroy();

    res.status(200).json({
      success: true,
      message: 'Harvest deleted successfully',
      data: { id: harvestId }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get harvest statistics
exports.getHarvestStats = async (req, res) => {
  try {
    const totalHarvests = await Harvest.count();
    const harvestByCrop = await Harvest.findAll({
      attributes: [
        'crop',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('weight')), 'totalWeight']
      ],
      group: ['crop'],
      raw: true
    });
    const totalWeightResult = await Harvest.findAll({
      attributes: [[sequelize.fn('SUM', sequelize.col('weight')), 'totalWeight']]
    });

    res.status(200).json({
      success: true,
      data: {
        totalHarvests,
        harvestByCrop,
        totalWeight: totalWeightResult[0]?.dataValues?.totalWeight || 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
