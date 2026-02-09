const express = require('express');
const sharedExpenseController = require('../controllers/sharedExpenseController');

const router = express.Router();

// Shared expense routes
router.get('/', sharedExpenseController.getAllExpenses);
router.post('/', sharedExpenseController.createExpense);
router.get('/stats', sharedExpenseController.getExpenseStats);
router.get('/member/:memberId', sharedExpenseController.getMemberExpenses);
router.get('/:id', sharedExpenseController.getExpense);
router.put('/:id', sharedExpenseController.updateExpense);
router.post('/:id/payment', sharedExpenseController.recordPayment);
router.delete('/:id', sharedExpenseController.deleteExpense);

module.exports = router;
