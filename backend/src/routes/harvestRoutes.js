const express = require('express');
const harvestController = require('../controllers/harvestController');

const router = express.Router();

// Harvest routes
router.get('/', harvestController.getAllHarvests);
router.post('/', harvestController.createHarvest);
router.get('/stats', harvestController.getHarvestStats);
router.get('/member/:memberId', harvestController.getHarvestsByMember);
router.get('/:id', harvestController.getHarvest);
router.put('/:id', harvestController.updateHarvest);
router.post('/:id/validate', harvestController.validateHarvest);
router.delete('/:id', harvestController.deleteHarvest);

module.exports = router;
