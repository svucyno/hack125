const express = require('express');
const router = express.Router();
const { 
    createMedicalRecord, 
    getMyRecords, 
    getPatientRecordsForDoctor 
} = require('../controllers/medicalRecord.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const { auditLog } = require('../middleware/audit.middleware');

// Routes configuration
router.post('/', protect, authorize('doctor', 'staff'), auditLog('create_record', 'MedicalRecord'), createMedicalRecord);
router.get('/my', protect, authorize('patient'), auditLog('view_record', 'MedicalRecord'), getMyRecords);
router.get('/patient/:patientId', protect, authorize('doctor', 'admin'), auditLog('view_record', 'MedicalRecord'), getPatientRecordsForDoctor);

module.exports = router;
