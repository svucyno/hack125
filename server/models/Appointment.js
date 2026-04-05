const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
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
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: { 
        type: String, 
        enum: ['pending', 'confirmed', 'completed', 'cancelled', 'emergency'], 
        default: 'pending' 
    },
    // Emergency data
    isEmergency: { type: Boolean, default: false },
    emergencyAlertedAt: Date,
    
    // Consultation metadata
    consultationLink: String,
    symptomsEnteredByPatient: String,
    urgencyLevel: { 
        type: String, 
        enum: ['low', 'medium', 'high', 'critical'], 
        default: 'low' 
    },
    
    // Access tracking
    doctorAccessedAt: Date,
    doctorAccessExpiresAt: Date,
    
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
