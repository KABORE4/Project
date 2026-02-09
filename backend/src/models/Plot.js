const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Plot = sequelize.define('Plot', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  plotCode: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: { msg: 'Plot code must be unique' },
    validate: {
      notEmpty: { msg: 'Plot code is required' }
    }
  },
  memberId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'members', key: 'id' }
  },
  size: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: { args: [0.1], msg: 'Minimum plot size is 0.1 hectares' }
    }
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true,
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true,
  },
  village: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  sector: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  soilType: {
    type: DataTypes.ENUM('sandy', 'loamy', 'clay', 'mixed'),
    allowNull: false,
  },
  waterAccess: {
    type: DataTypes.ENUM('well', 'river', 'rain-fed', 'irrigation'),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('active', 'fallow', 'under-development', 'rented-out'),
    defaultValue: 'active',
  },
  crops: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  registrationDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
}, {
  timestamps: true,
  tableName: 'plots',
  indexes: [
    { fields: ['memberId'] },
    { fields: ['plotCode'], unique: true },
    { fields: ['status'] }
  ]
});

module.exports = Plot;

