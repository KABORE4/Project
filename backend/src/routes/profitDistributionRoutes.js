const express = require('express');
const profitDistributionController = require('../controllers/profitDistributionController');

const router = express.Router();

// Profit distribution routes
router.get('/', profitDistributionController.getAllDistributions);
router.post('/', profitDistributionController.createDistribution);
router.get('/stats', profitDistributionController.getDistributionStats);
router.get('/member/:memberId', profitDistributionController.getMemberDistributions);
router.get('/:id', profitDistributionController.getDistribution);
router.put('/:id', profitDistributionController.updateDistribution);
router.post('/:id/approve', profitDistributionController.approveDistribution);
router.post('/:id/payment', profitDistributionController.recordMemberPayment);
router.delete('/:id', profitDistributionController.deleteDistribution);

module.exports = router;
