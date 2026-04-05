const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const { protect, authorize } = require('../middleware/auth.middleware');
const AuditLog = require('../models/AuditLog');

// @route   POST /api/appointments
// @access  Doctor / Patient
router.post('/', protect, async (req, res) => {
    const { patient, doctor, startTime, endTime, type, urgencyLevel } = req.body;
    try {
        const appointment = await Appointment.create({
            patient,
            doctor,
            startTime,
            endTime,
            type,
            urgencyLevel,
            status: 'pending'
        });
        res.status(201).json(appointment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   GET /api/appointments/my
// @access  Patient (own appointments)
router.get('/my', protect, authorize('patient'), async (req, res) => {
    try {
        const appointments = await Appointment.find({ patient: req.user._id })
            .populate('doctor', 'firstName lastName specialization')
            .sort({ startTime: -1 });
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   GET /api/appointments/doctor
// @access  Doctor (their appointments)
router.get('/doctor', protect, authorize('doctor'), async (req, res) => {
    try {
        const appointments = await Appointment.find({ doctor: req.user._id })
            .populate('patient', 'firstName lastName email')
            .sort({ startTime: 1 });
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   PUT /api/appointments/:id/confirm
// @access  Doctor
router.put('/:id/confirm', protect, authorize('doctor'), async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { status: 'confirmed' },
            { new: true }
        );
        res.json(appointment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
