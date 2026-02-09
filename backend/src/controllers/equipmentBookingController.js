const { EquipmentBooking, Equipment, Member } = require('../models');
const { sequelize } = require('../config/database');

// Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await EquipmentBooking.findAll({
      include: [
        { model: Member, attributes: ['id', 'name', 'email', 'phone'] },
        { model: Equipment, attributes: ['id', 'name', 'type', 'rentalRate'] }
      ]
    });
    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get member bookings
exports.getMemberBookings = async (req, res) => {
  try {
    const bookings = await EquipmentBooking.findAll({
      where: { memberId: req.params.memberId },
      include: [{ model: Equipment, attributes: ['id', 'name', 'type'] }]
    });
    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single booking
exports.getBooking = async (req, res) => {
  try {
    const booking = await EquipmentBooking.findByPk(req.params.id, {
      include: [Member, Equipment]
    });
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create booking
exports.createBooking = async (req, res) => {
  try {
    const {
      bookingCode,
      memberId,
      equipmentId,
      startDate,
      endDate,
      purpose,
      operatorName,
      operatorPhone
    } = req.body;

    // Get equipment details for cost calculation
    const equipment = await Equipment.findByPk(equipmentId);
    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: 'Equipment not found'
      });
    }

    // Calculate rental cost
    const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
    const rentalCost = equipment.rentalRate * days;

    const booking = await EquipmentBooking.create({
      bookingCode,
      memberId,
      equipmentId,
      startDate,
      endDate,
      purpose,
      operatorName,
      operatorPhone,
      rentalCost,
      depositAmountRequired: rentalCost * 0.3
    });

    res.status(201).json({
      success: true,
      message: 'Equipment booked successfully',
      data: booking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Update booking
exports.updateBooking = async (req, res) => {
  try {
    const { status, damageReported, damageDescription, notes } = req.body;

    const booking = await EquipmentBooking.findByPk(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    await booking.update({ status, damageReported, damageDescription, notes });

    res.status(200).json({
      success: true,
      message: 'Booking updated successfully',
      data: booking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Confirm booking
exports.confirmBooking = async (req, res) => {
  try {
    const { approvedBy } = req.body;

    const booking = await EquipmentBooking.findByPk(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    await booking.update({ status: 'confirmed', approvedBy });

    res.status(200).json({
      success: true,
      message: 'Booking confirmed successfully',
      data: booking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Delete booking
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await EquipmentBooking.findByPk(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    const bookingId = booking.id;
    await booking.destroy();

    res.status(200).json({
      success: true,
      message: 'Booking deleted successfully',
      data: { id: bookingId }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get booking statistics
exports.getBookingStats = async (req, res) => {
  try {
    const totalBookings = await EquipmentBooking.count();
    const bookingsByStatus = await EquipmentBooking.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['status'],
      raw: true
    });
    const totalRentalRevenueResult = await EquipmentBooking.findAll({
      attributes: [[sequelize.fn('SUM', sequelize.col('rentalCost')), 'totalRevenue']],
      where: { status: 'completed' }
    });

    res.status(200).json({
      success: true,
      data: {
        totalBookings,
        bookingsByStatus,
        totalRentalRevenue: totalRentalRevenueResult[0]?.dataValues?.totalRevenue || 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
