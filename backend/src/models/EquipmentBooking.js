const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const EquipmentBooking = sequelize.define('EquipmentBooking', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  bookingCode: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: { msg: 'Booking code must be unique' },
  },
  memberId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'members', key: 'id' }
  },
  equipmentId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'equipment', key: 'id' }
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  purpose: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'in-use', 'completed', 'cancelled'),
    defaultValue: 'pending',
  },
  rentalCost: DataTypes.DECIMAL(15, 2),
  depositAmountRequired: DataTypes.DECIMAL(15, 2),
  depositPaid: { type: DataTypes.BOOLEAN, defaultValue: false },
  damageReported: DataTypes.BOOLEAN,
  damageDescription: DataTypes.TEXT,
  operatorName: DataTypes.STRING,
  operatorPhone: DataTypes.STRING,
  notes: DataTypes.TEXT,
  approvedBy: {
    type: DataTypes.UUID,
    references: { model: 'members', key: 'id' }
  }
}, {
  timestamps: true,
  tableName: 'equipment_bookings',
  indexes: [
    { fields: ['memberId'] },
    { fields: ['equipmentId'] },
    { fields: ['bookingCode'], unique: true },
    { fields: ['status'] }
  ]
});

module.exports = EquipmentBooking;
