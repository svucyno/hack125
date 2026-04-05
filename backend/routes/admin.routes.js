const express = require('express');
const router = express.Router();
const { getAllUsers, verifyDoctor, getAuditLogs } = require('../controllers/admin.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);
router.use(authorize('admin'));

router.get('/users', getAllUsers);
router.put('/users/:id/verify', verifyDoctor);
router.get('/audit-logs', getAuditLogs);

module.exports = router;
