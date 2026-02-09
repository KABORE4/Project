const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Sale = sequelize.define('Sale', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  saleCode: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: { msg: 'Sale code must be unique' },
  },
  harvestIds: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  memberIds: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  crop: {
    type: DataTypes.ENUM('cotton', 'millet', 'sorghum', 'maize', 'sesame', 'peanut'),
    allowNull: false,
  },
  totalWeight: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    validate: { min: 0 }
  },
  unit: {
    type: DataTypes.ENUM('kg', 'ton', 'bag'),
    defaultValue: 'kg',
  },
  buyerName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  buyerContact: DataTypes.STRING,
  unitPrice: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    validate: { min: 0 }
  },
  totalRevenue: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    validate: { min: 0 }
  },
  currency: {
    type: DataTypes.ENUM('XOF', 'USD', 'EUR'),
    defaultValue: 'XOF',
  },
  saleDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'partial', 'completed'),
    defaultValue: 'pending',
  },
  paymentMethod: {
    type: DataTypes.ENUM('cash', 'check', 'transfer', 'mobile-money'),
    defaultValue: 'cash',
  },
  deliveryDate: DataTypes.DATE,
  deliveryLocation: DataTypes.STRING,
  transportCost: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },
  qualityGrade: {
    type: DataTypes.ENUM('A', 'B', 'C'),
    defaultValue: 'B',
  },
  status: {
    type: DataTypes.ENUM('negotiation', 'confirmed', 'completed', 'cancelled'),
    defaultValue: 'negotiation',
  },
  notes: DataTypes.TEXT,
  documents: { type: DataTypes.JSON, defaultValue: [] }
}, {
  timestamps: true,
  tableName: 'sales',
  indexes: [
    { fields: ['saleCode'], unique: true },
    { fields: ['status'] },
    { fields: ['crop'] }
  ]
});

module.exports = Sale;
