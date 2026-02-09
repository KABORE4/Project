const express = require('express');
const plotController = require('../controllers/plotController');

const router = express.Router();

// Plot routes
router.get('/', plotController.getAllPlots);
router.post('/', plotController.createPlot);
router.get('/stats', plotController.getPlotStats);
router.get('/member/:memberId', plotController.getPlotsByMember);
router.get('/:id', plotController.getPlot);
router.put('/:id', plotController.updatePlot);
router.delete('/:id', plotController.deletePlot);

module.exports = router;
