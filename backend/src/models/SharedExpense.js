const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SharedExpense = sequelize.define('SharedExpense', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  expenseCode: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: { msg: 'Expense code must be unique' },
  },
  category: {
    type: DataTypes.ENUM('maintenance', 'fertilizer', 'seeds', 'fuel', 'labor', 'storage', 'transport', 'other'),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    validate: { min: 0 }
  },
  currency: {
    type: DataTypes.ENUM('XOF', 'USD', 'EUR'),
    defaultValue: 'XOF',
  },
  paidBy: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'members', key: 'id' }
  },
  beneficiaries: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  expenseDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'settled'),
    defaultValue: 'pending',
  },
  attachments: { type: DataTypes.JSON, defaultValue: [] },
  approvedBy: {
    type: DataTypes.UUID,
    references: { model: 'members', key: 'id' }
  },
  notes: DataTypes.TEXT
}, {
  timestamps: true,
  tableName: 'shared_expenses',
  indexes: [
    { fields: ['paidBy'] },
    { fields: ['expenseCode'], unique: true },
    { fields: ['status'] },
    { fields: ['category'] }
  ]
});

module.exports = SharedExpense;
