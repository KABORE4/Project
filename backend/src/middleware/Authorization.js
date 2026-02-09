// Role-based permission middleware
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.userRole) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    if (!allowedRoles.includes(req.userRole)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Only ${allowedRoles.join(', ')} can access this resource.`
      });
    }

    next();
  };
};

module.exports = { authorize };
