const MedicalRecord = require('../models/MedicalRecord');
const memoryStore = require('../services/memoryStore');
const mongoose = require('mongoose');

exports.createMedicalRecord = async (req, res) => {
    const { patient, symptoms, diagnosis, prescription, urgency, appointmentId } = req.body;

    try {
        let record;
        if (mongoose.connection.readyState === 1) {
            record = await MedicalRecord.create({
                patient, doctor: req.user._id, appointment: appointmentId,
                symptoms, diagnosis, prescription, urgency
            });
        } else {
            console.warn('⚠️ DB Disconnected: Using MemoryStore for record creation');
            record = await memoryStore.createRecord({ 
                patient, doctor: req.user._id, appointment: appointmentId,
                symptoms, diagnosis, prescription, urgency 
            });
        }
        res.status(201).json(record);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMyRecords = async (req, res) => {
    try {
        let records;
        if (mongoose.connection.readyState === 1) {
            records = await MedicalRecord.find({ patient: req.user._id })
                .populate('doctor', 'firstName lastName specialization')
                .sort({ createdAt: -1 });
        } else {
            console.warn('⚠️ DB Disconnected: Fetching MemoryStore records for patient');
            records = await memoryStore.getRecordsByPatient(req.user._id);
            // Mock doctor population
            records = records.map(r => ({ ...r, doctor: { firstName: 'System', lastName: 'Assistant', specialization: 'Emergency' } }));
        }
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getPatientRecordsForDoctor = async (req, res) => {
    const { patientId } = req.params;

    try {
        let records;
        if (mongoose.connection.readyState === 1) {
            records = await MedicalRecord.find({ patient: patientId })
                .populate('doctor', 'firstName lastName specialization')
                .sort({ createdAt: -1 });
        } else {
            console.warn('⚠️ DB Disconnected: Fetching MemoryStore records for doctor');
            records = await memoryStore.getRecordsByPatient(patientId);
            records = records.map(r => ({ ...r, doctor: { firstName: 'System', lastName: 'Assistant', specialization: 'Emergency' } }));
        }
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
