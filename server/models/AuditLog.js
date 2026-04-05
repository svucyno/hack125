const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    action: { 
        type: String, 
        required: true,
        enum: ['login', 'view_record', 'update_record', 'emergency_alert', 'appointment_booked', 'record_deleted'] 
    },
    resource: { 
        type: String, 
        required: true 
    },
    details: { 
        type: String, 
        required: true 
    },
    timestamp: { 
        type: Date, 
        default: Date.now,
        immutable: true 
    },
    ipAddress: String,
    userAgent: String
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
