const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Harvest = sequelize.define('Harvest', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  harvestCode: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: { msg: 'Harvest code must be unique' },
  },
  memberId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'members', key: 'id' }
  },
  plotId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'plots', key: 'id' }
  },
  crop: {
    type: DataTypes.ENUM('cotton', 'millet', 'sorghum', 'maize', 'sesame', 'peanut'),
    allowNull: false,
  },
  weight: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    validate: { min: 0 }
  },
  unit: {
    type: DataTypes.ENUM('kg', 'ton', 'bag'),
    defaultValue: 'kg',
  },
  harvestDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  quality: {
    type: DataTypes.ENUM('excellent', 'good', 'average', 'poor'),
    defaultValue: 'good',
  },
  status: {
    type: DataTypes.ENUM('pending', 'validated', 'stored', 'sold'),
    defaultValue: 'pending',
  },
  storageLocation: DataTypes.STRING,
  estimatedValue: DataTypes.DECIMAL(15, 2),
  notes: DataTypes.TEXT,
  photos: { type: DataTypes.JSON, defaultValue: [] },
  validatedBy: { type: DataTypes.UUID, references: { model: 'members', key: 'id' } },
  validationDate: DataTypes.DATE
}, {
  timestamps: true,
  tableName: 'harvests',
  indexes: [
    { fields: ['memberId'] },
    { fields: ['plotId'] },
    { fields: ['harvestCode'], unique: true },
    { fields: ['status'] }
  ]
});

module.exports = Harvest;
