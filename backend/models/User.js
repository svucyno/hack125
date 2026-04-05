const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['patient', 'doctor', 'staff', 'admin'], 
        default: 'patient' 
    },
    // Doctor specific fields
    licenseNumber: String,
    specialization: String,
    isVerified: { type: Boolean, default: false },
    verifiedAt: Date,
    // Patient specific fields
    phoneNumber: String,
    dateOfBirth: Date,
    emergencyContact: {
        name: String,
        relation: String,
        phone: String
    },
    // Meta
    createdAt: { type: Date, default: Date.now },
    lastLogin: Date
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to verify password
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
