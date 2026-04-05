const memoryStore = require('../services/memoryStore');
const mongoose = require('mongoose');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '30d',
    });
};

exports.registerUser = async (req, res) => {
    const { firstName, lastName, email, password, role, licenseNumber, specialization } = req.body;

    try {
        let user;
        if (mongoose.connection.readyState === 1) {
            const userExists = await User.findOne({ email });
            if (userExists) return res.status(400).json({ message: 'User already exists' });
            user = await User.create({ firstName, lastName, email, password, role, licenseNumber, specialization });
        } else {
            console.warn('⚠️ DB Disconnected: Using MemoryStore for registration');
            const exists = await memoryStore.findUserByEmail(email);
            if (exists) return res.status(400).json({ message: 'User exists in memory' });
            user = await memoryStore.createUser({ firstName, lastName, email, password, role, licenseNumber, specialization });
        }

        res.status(201).json({
            _id: user._id, firstName, lastName, email, role,
            isVerified: user.isVerified,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        let user;
        if (mongoose.connection.readyState === 1) {
            user = await User.findOne({ email });
        } else {
            console.warn('⚠️ DB Disconnected: Searching MemoryStore for login');
            user = await memoryStore.findUserByEmail(email);
        }

        if (user && (user.comparePassword ? await user.comparePassword(password) : user.password === password)) {
            res.json({
                _id: user._id, firstName: user.firstName, lastName: user.lastName,
                email: user.email, role: user.role, isVerified: user.isVerified,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};
