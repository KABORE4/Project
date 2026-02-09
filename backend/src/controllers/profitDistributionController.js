const { ProfitDistribution, Sale, Member } = require('../models');
const { sequelize } = require('../config/database');

// Get all distributions
exports.getAllDistributions = async (req, res) => {
  try {
    const distributions = await ProfitDistribution.findAll({
      include: [
        { model: Sale, attributes: ['id', 'saleCode', 'totalRevenue'] }
      ]
    });
    res.status(200).json({
      success: true,
      count: distributions.length,
      data: distributions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get member distributions
exports.getMemberDistributions = async (req, res) => {
  try {
    const distributions = await ProfitDistribution.findAll({
      include: [
        { model: Sale, attributes: ['id', 'saleCode', 'totalRevenue'] }
      ]
    });
    
    // Filter distributions containing this member
    const memberDistributions = distributions.filter(dist => {
      const memberDists = dist.memberDistributions || [];
      return memberDists.some(m => m.memberId === req.params.memberId);
    });

    res.status(200).json({
      success: true,
      count: memberDistributions.length,
      data: memberDistributions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single distribution
exports.getDistribution = async (req, res) => {
  try {
    const distribution = await ProfitDistribution.findByPk(req.params.id, {
      include: [Sale]
    });
    if (!distribution) {
      return res.status(404).json({
        success: false,
        message: 'Distribution not found'
      });
    }
    res.status(200).json({
      success: true,
      data: distribution
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create distribution
exports.createDistribution = async (req, res) => {
  try {
    const {
      distributionCode,
      saleId,
      totalRevenue,
      expenses,
      cooperativeShare,
      memberDistributions,
      distributionMethod,
      distributionDate,
      notes
    } = req.body;

    // Generate distribution code if not provided
    const finalDistributionCode = distributionCode || `DIST-${Date.now()}`;

    // Calculate totals
    const totalExpenses = (expenses || []).reduce((sum, e) => sum + (e.amount || 0), 0);
    const cooperativeFees = totalRevenue * cooperativeShare;
    const netProfit = totalRevenue - totalExpenses - cooperativeFees;

    // Calculate member amounts
    const memberDistributionsWithAmount = (memberDistributions || []).map((m) => ({
      ...m,
      amountDue: (netProfit * m.sharePercentage) / 100,
      amountPaid: 0,
      status: 'pending'
    }));

    const distribution = await ProfitDistribution.create({
      distributionCode: finalDistributionCode,
      saleId,
      totalRevenue,
      expenses,
      totalExpenses,
      cooperativeShare,
      cooperativeFees,
      netProfit,
      memberDistributions: memberDistributionsWithAmount,
      distributionMethod: distributionMethod || 'equal',
      distributionDate,
      notes
    });

    res.status(201).json({
      success: true,
      message: 'Distribution plan created successfully',
      data: distribution
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Approve distribution
exports.approveDistribution = async (req, res) => {
  try {
    const { approvedBy } = req.body;

    const distribution = await ProfitDistribution.findByPk(req.params.id);

    if (!distribution) {
      return res.status(404).json({
        success: false,
        message: 'Distribution not found'
      });
    }

    await distribution.update({
      status: 'approved',
      approvedBy,
      approvalDate: new Date()
    });

    res.status(200).json({
      success: true,
      message: 'Distribution approved successfully',
      data: distribution
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Record member payment
exports.recordMemberPayment = async (req, res) => {
  try {
    const { memberId, amountPaid } = req.body;

    const distribution = await ProfitDistribution.findByPk(req.params.id);
    if (!distribution) {
      return res.status(404).json({
        success: false,
        message: 'Distribution not found'
      });
    }

    // Find and update member distribution
    const memberDists = distribution.memberDistributions || [];
    const memberDist = memberDists.find((m) => m.memberId === memberId);
    if (!memberDist) {
      return res.status(404).json({
        success: false,
        message: 'Member not found in distribution'
      });
    }

    memberDist.amountPaid = (memberDist.amountPaid || 0) + amountPaid;
    memberDist.paymentDate = new Date();
    if (memberDist.amountPaid >= memberDist.amountDue) {
      memberDist.status = 'completed';
    } else {
      memberDist.status = 'partial';
    }

    await distribution.update({ memberDistributions: memberDists });

    res.status(200).json({
      success: true,
      message: 'Payment recorded successfully',
      data: distribution
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Update distribution
exports.updateDistribution = async (req, res) => {
  try {
    const { status, notes } = req.body;

    const distribution = await ProfitDistribution.findByPk(req.params.id);

    if (!distribution) {
      return res.status(404).json({
        success: false,
        message: 'Distribution not found'
      });
    }

    await distribution.update({ status, notes });

    res.status(200).json({
      success: true,
      message: 'Distribution updated successfully',
      data: distribution
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Delete distribution
exports.deleteDistribution = async (req, res) => {
  try {
    const distribution = await ProfitDistribution.findByPk(req.params.id);

    if (!distribution) {
      return res.status(404).json({
        success: false,
        message: 'Distribution not found'
      });
    }

    const distributionId = distribution.id;
    await distribution.destroy();

    res.status(200).json({
      success: true,
      message: 'Distribution deleted successfully',
      data: { id: distributionId }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get distribution statistics
exports.getDistributionStats = async (req, res) => {
  try {
    const totalDistributedResult = await ProfitDistribution.findAll({
      attributes: [[sequelize.fn('SUM', sequelize.col('netProfit')), 'totalProfit']]
    });

    const distributionByStatus = await ProfitDistribution.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('netProfit')), 'totalAmount']
      ],
      group: ['status'],
      raw: true
    });

    res.status(200).json({
      success: true,
      data: {
        totalDistributed: totalDistributedResult[0]?.dataValues?.totalProfit || 0,
        distributionByStatus,
        pendingPayments: 'Calculated from memberDistributions array'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
