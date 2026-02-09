const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Equipment = sequelize.define('Equipment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  equipmentCode: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: { msg: 'Equipment code must be unique' },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('heavy', 'light', 'transport', 'irrigation', 'storage'),
    allowNull: false,
  },
  description: DataTypes.TEXT,
  purchaseDate: DataTypes.DATE,
  purchasePrice: DataTypes.DECIMAL(15, 2),
  currentValue: DataTypes.DECIMAL(15, 2),
  status: {
    type: DataTypes.ENUM('available', 'in-use', 'maintenance', 'retired'),
    defaultValue: 'available',
  },
  rentalRate: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: { min: 0 }
  },
  rentalUnit: {
    type: DataTypes.ENUM('per-hour', 'per-day', 'per-week'),
    defaultValue: 'per-day',
  },
  lastMaintenance: DataTypes.DATE,
  nextMaintenance: DataTypes.DATE,
  maintenanceCost: DataTypes.DECIMAL(15, 2),
  images: { type: DataTypes.JSON, defaultValue: [] },
  specifications: DataTypes.TEXT,
  location: DataTypes.STRING,
  ownershipType: {
    type: DataTypes.ENUM('cooperative', 'member-owned', 'leased'),
    defaultValue: 'cooperative',
  }
}, {
  timestamps: true,
  tableName: 'equipment',
  indexes: [
    { fields: ['equipmentCode'], unique: true },
    { fields: ['status'] },
    { fields: ['type'] }
  ]
});

module.exports = Equipment;
