// Generate unique codes for records
const generateCode = (prefix, length = 4) => {
  const timestamp = Date.now().toString().slice(-4);
  const random = Math.random().toString(36).substring(2, length + 2).toUpperCase();
  return `${prefix}-${timestamp}${random}`;
};

// Calculate profit distribution shares
const calculateDistributionShares = (members, method = 'equal') => {
  const totalMembers = members.length;

  if (method === 'equal') {
    return members.map((member) => ({
      memberId: member._id,
      sharePercentage: 100 / totalMembers
    }));
  }

  // Default equal distribution
  return members.map((member) => ({
    memberId: member._id,
    sharePercentage: 100 / totalMembers
  }));
};

// Calculate rental cost
const calculateRentalCost = (rate, startDate, endDate, unit = 'per-day') => {
  if (unit === 'per-hour') {
    return (rate * (new Date(endDate) - new Date(startDate))) / (1000 * 60 * 60);
  } else if (unit === 'per-week') {
    return (rate * Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24 * 7)));
  }
  // per-day
  return (rate * Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)));
};

// Format currency
const formatCurrency = (amount, currency = 'XOF') => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

module.exports = {
  generateCode,
  calculateDistributionShares,
  calculateRentalCost,
  formatCurrency
};
