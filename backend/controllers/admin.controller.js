const User = require('../models/User');
const memoryStore = require('../services/memoryStore');
const mongoose = require('mongoose');

exports.getAllUsers = async (req, res) => {
    try {
        let users;
        if (mongoose.connection.readyState === 1) {
            users = await User.find({}).select('-password').sort({ createdAt: -1 });
        } else {
            console.warn('⚠️ DB Disconnected: Fetching MemoryStore users for admin');
            users = await memoryStore.getAllUsers();
        }
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.verifyDoctor = async (req, res) => {
    try {
        let user;
        if (mongoose.connection.readyState === 1) {
            user = await User.findById(req.params.id);
            if (user && user.role === 'doctor') {
                user.isVerified = req.body.isVerified;
                await user.save();
            }
        } else {
            console.warn('⚠️ DB Disconnected: Verifying MemoryStore doctor');
            user = await memoryStore.findUserById(req.params.id);
            if (user && user.role === 'doctor') {
                user.isVerified = req.body.isVerified;
            }
        }

        if (user && user.role === 'doctor') {
            res.json({ message: `Doctor ${user.isVerified ? 'verified' : 'unverified'} successfully` });
        } else {
            res.status(404).json({ message: 'Doctor not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAuditLogs = async (req, res) => {
    try {
        let logs = [];
        if (mongoose.connection.readyState === 1) {
            const AuditLog = require('../models/AuditLog');
            logs = await AuditLog.find({}).populate('user', 'firstName lastName email role').sort({ timestamp: -1 });
        }
        res.json(logs);
    } catch (error) {
        res.json([]); // Return empty list on error for demo stability
    }
};
