const express = require('express');
const memberController = require('../controllers/memberController');

const router = express.Router();

// Member routes
router.get('/', memberController.getAllMembers);
router.post('/', memberController.createMember);
router.get('/stats', memberController.getMemberStats);
router.get('/:id', memberController.getMember);
router.put('/:id', memberController.updateMember);
router.delete('/:id', memberController.deleteMember);

module.exports = router;
