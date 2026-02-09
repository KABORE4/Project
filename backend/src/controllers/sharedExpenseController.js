const { SharedExpense, Member } = require('../models');
const { sequelize } = require('../config/database');
const { Op } = require('sequelize');

// Get all expenses
exports.getAllExpenses = async (req, res) => {
  try {
    const expenses = await SharedExpense.findAll({
      include: [
        { model: Member, attributes: ['id', 'name', 'email'], as: 'payer' }
      ]
    });
    res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get member expenses
exports.getMemberExpenses = async (req, res) => {
  try {
    const expenses = await SharedExpense.findAll({
      where: {
        [Op.or]: [
          { paidBy: req.params.memberId }
        ]
      },
      include: [
        { model: Member, attributes: ['id', 'name', 'email'], as: 'payer' }
      ]
    });
    res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single expense
exports.getExpense = async (req, res) => {
  try {
    const expense = await SharedExpense.findByPk(req.params.id, {
      include: [
        { model: Member, attributes: ['id', 'name', 'email'], as: 'payer' }
      ]
    });
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }
    res.status(200).json({
      success: true,
      data: expense
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create expense
exports.createExpense = async (req, res) => {
  try {
    const {
      expenseCode,
      category,
      description,
      amount,
      currency,
      paidBy,
      beneficiaries = [],
      expenseDate,
      notes
    } = req.body;

    // Generate expense code if not provided
    const finalExpenseCode = expenseCode || `EXP-${Date.now()}`;

    // Calculate total shares only if beneficiaries exist
    if (beneficiaries && beneficiaries.length > 0) {
      const totalShare = beneficiaries.reduce((sum, b) => sum + (b.sharePercentage || 0), 0);
      if (totalShare !== 100) {
        return res.status(400).json({
          success: false,
          message: 'Beneficiary shares must total 100%'
        });
      }
    }

    // Calculate amounts due
    const beneficiariesWithAmount = beneficiaries && beneficiaries.length > 0 
      ? beneficiaries.map((b) => ({
          ...b,
          amountDue: (amount * b.sharePercentage) / 100,
          amountPaid: 0,
          status: 'pending'
        }))
      : [];

    const expense = await SharedExpense.create({
      expenseCode: finalExpenseCode,
      category,
      description,
      amount,
      currency: currency || 'XOF',
      paidBy,
      beneficiaries: beneficiariesWithAmount,
      expenseDate,
      notes
    });

    res.status(201).json({
      success: true,
      message: 'Expense recorded successfully',
      data: expense
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Update expense
exports.updateExpense = async (req, res) => {
  try {
    const { status, notes, approvedBy } = req.body;

    const expense = await SharedExpense.findByPk(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    await expense.update({ status, notes, approvedBy });

    res.status(200).json({
      success: true,
      message: 'Expense updated successfully',
      data: expense
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Record payment for expense
exports.recordPayment = async (req, res) => {
  try {
    const { beneficiaryId, amountPaid } = req.body;

    const expense = await SharedExpense.findByPk(req.params.id);
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    // Find and update beneficiary
    const beneficiaries = expense.beneficiaries || [];
    const beneficiary = beneficiaries.find(
      (b) => b.memberId === beneficiaryId
    );
    if (!beneficiary) {
      return res.status(404).json({
        success: false,
        message: 'Beneficiary not found'
      });
    }

    beneficiary.amountPaid = (beneficiary.amountPaid || 0) + amountPaid;
    if (beneficiary.amountPaid >= beneficiary.amountDue) {
      beneficiary.status = 'paid';
    } else {
      beneficiary.status = 'partial';
    }

    await expense.update({ beneficiaries });

    res.status(200).json({
      success: true,
      message: 'Payment recorded successfully',
      data: expense
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Delete expense
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await SharedExpense.findByPk(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    const expenseId = expense.id;
    await expense.destroy();

    res.status(200).json({
      success: true,
      message: 'Expense deleted successfully',
      data: { id: expenseId }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get expense statistics
exports.getExpenseStats = async (req, res) => {
  try {
    const totalExpensesResult = await SharedExpense.findAll({
      attributes: [[sequelize.fn('SUM', sequelize.col('amount')), 'total']]
    });

    const expensesByCategory = await SharedExpense.findAll({
      attributes: [
        'category',
        [sequelize.fn('SUM', sequelize.col('amount')), 'total'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['category'],
      raw: true
    });

    res.status(200).json({
      success: true,
      data: {
        totalExpenses: totalExpensesResult[0]?.dataValues?.total || 0,
        expensesByCategory,
        pendingPayments: 'Calculated from beneficiaries array'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
