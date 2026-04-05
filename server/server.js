const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketio = require('socket.io');

// Middleware
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const compression = require('compression');

// Routes
const authRoutes = require('./routes/auth.routes');
const medicalRecordRoutes = require('./routes/medicalRecord.routes');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

// Security & Optimization Middleware
app.use(helmet()); // Set security headers
app.use(xss()); // Prevent XSS attacks
app.use(hpp()); // Prevent HTTP Parameter Pollution
app.use(compression()); // Compress responses
app.use(cors());
app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/records', medicalRecordRoutes);

// Socket.io for Real-time Emergency Alerts
io.on('connection', (socket) => {
    console.log('New connection:', socket.id);

    // Emergency SOS Alert
    socket.on('emergency_sos', (data) => {
        console.log('EMERGENCY SOS RECEIVED:', data);
        // Broadcast to all staff and doctors
        io.emit('emergency_alert', {
            ...data,
            timestamp: new Date()
        });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Root Route
app.get('/', (req, res) => {
    res.send('MEDI-CONNECT Secure API is running...');
});

// Database Connection
const PORT = process.env.PORT || 5000;
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/mediconnect';

mongoose.connect(mongoURI)
    .then(() => {
        console.log('MongoDB connected successfully');
        server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => {
        console.error('Database connection error:', err.message);
        process.exit(1);
    });
