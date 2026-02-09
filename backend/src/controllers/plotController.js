const { Plot, Member } = require('../models');
const { sequelize } = require('../config/database');
const { Op } = require('sequelize');

// Get all plots
exports.getAllPlots = async (req, res) => {
  try {
    const plots = await Plot.findAll({
      include: [{ model: Member, attributes: ['id', 'name', 'email', 'village'] }]
    });
    res.status(200).json({
      success: true,
      count: plots.length,
      data: plots
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get plots by member
exports.getPlotsByMember = async (req, res) => {
  try {
    const plots = await Plot.findAll({
      where: { memberId: req.params.memberId },
      include: [{ model: Member, attributes: ['id', 'name', 'email', 'village'] }]
    });
    res.status(200).json({
      success: true,
      count: plots.length,
      data: plots
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single plot
exports.getPlot = async (req, res) => {
  try {
    const plot = await Plot.findByPk(req.params.id, {
      include: [{ model: Member, attributes: ['id', 'name', 'email'] }]
    });
    if (!plot) {
      return res.status(404).json({
        success: false,
        message: 'Plot not found'
      });
    }
    res.status(200).json({
      success: true,
      data: plot
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create plot
exports.createPlot = async (req, res) => {
  try {
    const { plotCode, memberId, size, location, soilType, waterAccess, crops } = req.body;

    const plot = await Plot.create({
      plotCode,
      memberId,
      size,
      location,
      soilType,
      waterAccess,
      crops
    });

    res.status(201).json({
      success: true,
      message: 'Plot created successfully',
      data: plot
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Update plot
exports.updatePlot = async (req, res) => {
  try {
    const { size, soilType, waterAccess, status, crops, notes } = req.body;

    const plot = await Plot.findByPk(req.params.id);

    if (!plot) {
      return res.status(404).json({
        success: false,
        message: 'Plot not found'
      });
    }

    await plot.update({ size, soilType, waterAccess, status, crops, notes });

    res.status(200).json({
      success: true,
      message: 'Plot updated successfully',
      data: plot
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Delete plot
exports.deletePlot = async (req, res) => {
  try {
    const plot = await Plot.findByPk(req.params.id);

    if (!plot) {
      return res.status(404).json({
        success: false,
        message: 'Plot not found'
      });
    }

    const plotId = plot.id;
    await plot.destroy();

    res.status(200).json({
      success: true,
      message: 'Plot deleted successfully',
      data: { id: plotId }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get plot statistics
exports.getPlotStats = async (req, res) => {
  try {
    const totalPlots = await Plot.count();
    const activePlots = await Plot.count({ where: { status: 'active' } });
    const totalAreaResult = await Plot.findAll({
      attributes: [[sequelize.fn('SUM', sequelize.col('size')), 'totalSize']]
    });

    res.status(200).json({
      success: true,
      data: {
        totalPlots,
        activePlots,
        totalArea: totalAreaResult[0]?.dataValues?.totalSize || 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
