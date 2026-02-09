const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ProfitDistribution = sequelize.define('ProfitDistribution', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  distributionCode: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: { msg: 'Distribution code must be unique' },
  },
  saleId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'sales', key: 'id' }
  },
  totalRevenue: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    validate: { min: 0 }
  },
  expenses: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  totalExpenses: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
    validate: { min: 0 }
  },
  cooperativeShare: {
    type: DataTypes.DECIMAL(4, 3),
    defaultValue: 0.1,
  },
  cooperativeFees: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
  },
  netProfit: DataTypes.DECIMAL(15, 2),
  distributionMethod: {
    type: DataTypes.ENUM('equal', 'by-harvest', 'by-area', 'custom'),
    defaultValue: 'equal',
  },
  memberDistributions: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  distributionDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'distributed', 'completed'),
    defaultValue: 'pending',
  },
  approvedBy: {
    type: DataTypes.UUID,
    references: { model: 'members', key: 'id' }
  },
  approvalDate: DataTypes.DATE,
  notes: DataTypes.TEXT
}, {
  timestamps: true,
  tableName: 'profit_distributions',
  indexes: [
    { fields: ['saleId'] },
    { fields: ['distributionCode'], unique: true },
    { fields: ['status'] }
  ]
});

module.exports = ProfitDistribution;
