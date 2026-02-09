const { sequelize } = require('../config/database');
const Member = require('./Member');
const Plot = require('./Plot');
const Harvest = require('./Harvest');
const Equipment = require('./Equipment');
const EquipmentBooking = require('./EquipmentBooking');
const SharedExpense = require('./SharedExpense');
const Sale = require('./Sale');
const ProfitDistribution = require('./ProfitDistribution');

// Define Associations
// Member associations
Member.hasMany(Plot, { foreignKey: 'memberId', onDelete: 'CASCADE' });
Plot.belongsTo(Member, { foreignKey: 'memberId' });

Member.hasMany(Harvest, { foreignKey: 'memberId', onDelete: 'CASCADE' });
Harvest.belongsTo(Member, { foreignKey: 'memberId' });

Member.hasMany(EquipmentBooking, { foreignKey: 'memberId', onDelete: 'CASCADE' });
EquipmentBooking.belongsTo(Member, { foreignKey: 'memberId' });

Member.hasMany(SharedExpense, { foreignKey: 'paidBy', onDelete: 'CASCADE', as: 'expensesPaid' });
SharedExpense.belongsTo(Member, { foreignKey: 'paidBy', as: 'payer' });

// Plot associations
Plot.hasMany(Harvest, { foreignKey: 'plotId', onDelete: 'CASCADE' });
Harvest.belongsTo(Plot, { foreignKey: 'plotId' });

// Harvest associations
Member.hasMany(Harvest, { foreignKey: 'validatedBy', as: 'harvestsValidated' });
Harvest.belongsTo(Member, { foreignKey: 'validatedBy', as: 'validator' });

// Equipment associations
Equipment.hasMany(EquipmentBooking, { foreignKey: 'equipmentId', onDelete: 'CASCADE' });
EquipmentBooking.belongsTo(Equipment, { foreignKey: 'equipmentId' });

// EquipmentBooking associations
Member.hasMany(EquipmentBooking, { foreignKey: 'approvedBy', as: 'bookingsApproved' });
EquipmentBooking.belongsTo(Member, { foreignKey: 'approvedBy', as: 'approver' });

// SharedExpense associations
Member.hasMany(SharedExpense, { foreignKey: 'approvedBy', as: 'expensesApproved' });
SharedExpense.belongsTo(Member, { foreignKey: 'approvedBy', as: 'approver' });

// Sale associations
Member.hasMany(Sale, { foreignKey: 'recordedBy', as: 'salesRecorded' });
Sale.belongsTo(Member, { foreignKey: 'recordedBy', as: 'recorder' });

// ProfitDistribution associations
Sale.hasMany(ProfitDistribution, { foreignKey: 'saleId', onDelete: 'CASCADE' });
ProfitDistribution.belongsTo(Sale, { foreignKey: 'saleId' });

Member.hasMany(ProfitDistribution, { foreignKey: 'approvedBy', as: 'distributionsApproved' });
ProfitDistribution.belongsTo(Member, { foreignKey: 'approvedBy', as: 'approver' });

module.exports = {
  sequelize,
  Member,
  Plot,
  Harvest,
  Equipment,
  EquipmentBooking,
  SharedExpense,
  Sale,
  ProfitDistribution
};
