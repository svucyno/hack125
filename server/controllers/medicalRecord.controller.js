const MedicalRecord = require('../models/MedicalRecord');
const Appointment = require('../models/Appointment');
const AuditLog = require('../models/AuditLog');

// @desc    Create a new medical record
// @route   POST /api/records
// @access  Private (Doctor/Staff)
exports.createMedicalRecord = async (req, res) => {
    const { patient, symptoms, diagnosis, prescription, urgency, appointmentId } = req.body;

    try {
        const record = await MedicalRecord.create({
            patient,
            doctor: req.user._id,
            appointment: appointmentId,
            symptoms,
            diagnosis,
            prescription,
            urgency
        });

        res.status(201).json(record);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get patient's own records
// @route   GET /api/records/my
// @access  Private (Patient)
exports.getMyRecords = async (req, res) => {
    try {
        const records = await MedicalRecord.find({ patient: req.user._id })
            .populate('doctor', 'firstName lastName specialization')
            .sort({ createdAt: -1 });
        
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get patient records for a doctor (during appointment)
// @route   GET /api/records/patient/:patientId
// @access  Private (Doctor)
exports.getPatientRecordsForDoctor = async (req, res) => {
    const { patientId } = req.params;

    try {
        // Check if doctor has an active/confirmed appointment with this patient
        const appointment = await Appointment.findOne({
            patient: patientId,
            doctor: req.user._id,
            status: { $in: ['confirmed', 'emergency'] }
        });

        if (!appointment && req.user.role !== 'admin') {
            return res.status(403).json({ 
                message: 'No active consultation session found. Access to medical records is restricted.' 
            });
        }

        const records = await MedicalRecord.find({ patient: patientId })
            .populate('doctor', 'firstName lastName specialization')
            .sort({ createdAt: -1 });

        res.json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
