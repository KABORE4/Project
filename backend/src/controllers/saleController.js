const { Sale, Harvest, Member } = require('../models');
const { sequelize } = require('../config/database');

// Get all sales
exports.getAllSales = async (req, res) => {
  try {
    const sales = await Sale.findAll();
    res.status(200).json({
      success: true,
      count: sales.length,
      data: sales
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get sales by member
exports.getSalesByMember = async (req, res) => {
  try {
    const sales = await Sale.findAll({
      where: sequelize.where(
        sequelize.fn('json_array_contains', sequelize.col('memberIds'), sequelize.literal(`'"${req.params.memberId}"'`)),
        sequelize.Op.eq,
        true
      )
    });
    res.status(200).json({
      success: true,
      count: sales.length,
      data: sales
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single sale
exports.getSale = async (req, res) => {
  try {
    const sale = await Sale.findByPk(req.params.id);
    if (!sale) {
      return res.status(404).json({
        success: false,
        message: 'Sale not found'
      });
    }
    res.status(200).json({
      success: true,
      data: sale
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create sale
exports.createSale = async (req, res) => {
  try {
    const {
      saleCode,
      harvestIds,
      memberIds,
      crop,
      totalWeight,
      unit,
      buyerName,
      buyerContact,
      unitPrice,
      currency,
      saleDate,
      transportCost,
      qualityGrade
    } = req.body;

    const totalRevenue = totalWeight * unitPrice;

    const sale = await Sale.create({
      saleCode,
      harvestIds,
      memberIds,
      crop,
      totalWeight,
      unit: unit || 'kg',
      buyerName,
      buyerContact,
      unitPrice,
      totalRevenue,
      currency: currency || 'XOF',
      saleDate,
      transportCost: transportCost || 0,
      qualityGrade: qualityGrade || 'B'
    });

    res.status(201).json({
      success: true,
      message: 'Sale recorded successfully',
      data: sale
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Update sale
exports.updateSale = async (req, res) => {
  try {
    const { status, paymentStatus, deliveryDate, deliveryLocation, notes } = req.body;

    const sale = await Sale.findByPk(req.params.id);

    if (!sale) {
      return res.status(404).json({
        success: false,
        message: 'Sale not found'
      });
    }

    await sale.update({ status, paymentStatus, deliveryDate, deliveryLocation, notes });

    res.status(200).json({
      success: true,
      message: 'Sale updated successfully',
      data: sale
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Record sale payment
exports.recordPayment = async (req, res) => {
  try {
    const { amountPaid } = req.body;

    const sale = await Sale.findByPk(req.params.id);
    if (!sale) {
      return res.status(404).json({
        success: false,
        message: 'Sale not found'
      });
    }

    const paymentStatus = amountPaid >= sale.totalRevenue ? 'completed' : 'partial';
    await sale.update({ paymentStatus });

    res.status(200).json({
      success: true,
      message: 'Payment recorded successfully',
      data: sale
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Delete sale
exports.deleteSale = async (req, res) => {
  try {
    const sale = await Sale.findByPk(req.params.id);

    if (!sale) {
      return res.status(404).json({
        success: false,
        message: 'Sale not found'
      });
    }

    const saleId = sale.id;
    await sale.destroy();

    res.status(200).json({
      success: true,
      message: 'Sale deleted successfully',
      data: { id: saleId }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get sales statistics
exports.getSalesStats = async (req, res) => {
  try {
    const totalSales = await Sale.count();
    const totalRevenueResult = await Sale.findAll({
      attributes: [[sequelize.fn('SUM', sequelize.col('totalRevenue')), 'totalRevenue']],
      where: sequelize.where(
        sequelize.col('status'),
        sequelize.Op.in,
        ['confirmed', 'completed']
      )
    });
    const salesByCrop = await Sale.findAll({
      attributes: [
        'crop',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('totalRevenue')), 'revenue']
      ],
      group: ['crop'],
      raw: true
    });

    res.status(200).json({
      success: true,
      data: {
        totalSales,
        totalRevenue: totalRevenueResult[0]?.dataValues?.totalRevenue || 0,
        salesByCrop
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
