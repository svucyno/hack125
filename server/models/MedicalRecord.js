const mongoose = require('mongoose');
const { encrypt, decrypt } = require('../services/encryption.service');

const medicalRecordSchema = new mongoose.Schema({
    patient: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    doctor: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    appointment: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Appointment' 
    },
    
    // Encrypted PHI data
    symptoms: { type: String, required: true },
    diagnosis: { type: String, required: true },
    prescription: { type: String, required: true },
    
    // Non-PHI metadata
    urgency: { 
        type: String, 
        enum: ['routine', 'urgent', 'emergency'], 
        default: 'routine' 
    },
    
    // Record management
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Middleware to encrypt fields before saving
medicalRecordSchema.pre('save', function(next) {
    if (this.isModified('diagnosis')) {
        this.diagnosis = encrypt(this.diagnosis);
    }
    if (this.isModified('prescription')) {
        this.prescription = encrypt(this.prescription);
    }
    next();
});

// Getter to decrypt fields
medicalRecordSchema.set('toObject', { getters: true });
medicalRecordSchema.set('toJSON', { getters: true });

// Decryption for reading
medicalRecordSchema.post('init', function(doc) {
    if (doc.diagnosis) doc.diagnosis = decrypt(doc.diagnosis);
    if (doc.prescription) doc.prescription = decrypt(doc.prescription);
});

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);
