const express = require('express');
const equipmentController = require('../controllers/equipmentController');

const router = express.Router();

// Equipment routes
router.get('/', equipmentController.getAllEquipment);
router.post('/', equipmentController.createEquipment);
router.get('/available', equipmentController.getAvailableEquipment);
router.get('/stats', equipmentController.getEquipmentStats);
router.get('/:id', equipmentController.getEquipment);
router.put('/:id', equipmentController.updateEquipment);
router.delete('/:id', equipmentController.deleteEquipment);

module.exports = router;
