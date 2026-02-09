const express = require('express');
const saleController = require('../controllers/saleController');

const router = express.Router();

// Sale routes
router.get('/', saleController.getAllSales);
router.post('/', saleController.createSale);
router.get('/stats', saleController.getSalesStats);
router.get('/member/:memberId', saleController.getSalesByMember);
router.get('/:id', saleController.getSale);
router.put('/:id', saleController.updateSale);
router.post('/:id/payment', saleController.recordPayment);
router.delete('/:id', saleController.deleteSale);

module.exports = router;
