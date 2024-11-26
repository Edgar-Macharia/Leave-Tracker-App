const express = require('express');
const router = express.Router();

const leaveCtrl = require('../controllers/leave');
const auth = require('../middleware/auth')

router.post('/', auth.authenticateUser, leaveCtrl.createLeave);
router.get('/', auth.authenticateUser, leaveCtrl.getAllLeaves);
router.get('/user/:id', auth.authenticateUser, leaveCtrl.getOneLeave);
router.get('/user', auth.authenticateUser, leaveCtrl.getAllLeavesForUser);
router.get('/line-manager', auth.authenticateUser, auth.requireLineManager, leaveCtrl.getLeavesForLineManager);
router.put('/:id', auth.authenticateUser, leaveCtrl.updateLeave);
router.delete('/:id', auth.authenticateUser, leaveCtrl.deleteLeave);

router.put('/approve/:id', auth.authenticateUser, leaveCtrl.approveLeave);
router.put('/reject/:id', auth.authenticateUser, leaveCtrl.rejectLeave);
router.put('/cancel/:id', auth.authenticateUser, leaveCtrl.cancelLeave);

module.exports = router;