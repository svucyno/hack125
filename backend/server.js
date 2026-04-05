const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketio = require('socket.io');
const path = require('path');

// Middleware
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const compression = require('compression');

// Routes
const authRoutes = require('./routes/auth.routes');
const medicalRecordRoutes = require('./routes/medicalRecord.routes');
const adminRoutes = require('./routes/admin.routes');
const appointmentRoutes = require('./routes/appointment.routes');

const connectDB = require('./config/db');

dotenv.config();

// Connect to Database
connectDB();

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

// Security & Optimization Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            connectSrc: ["'self'", "ws:", "wss:"],
            imgSrc: ["'self'", "data:", "blob:"]
        },
    }
}));
app.use(xss()); 
app.use(hpp()); 
app.use(compression()); 
app.use(cors());
app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100 
});
app.use('/api/', limiter);

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/records', medicalRecordRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/appointments', appointmentRoutes);

// Socket.io for Real-time Emergency Alerts
io.on('connection', (socket) => {
    socket.on('emergency_sos', (data) => {
        io.emit('emergency_alert', {
            ...data,
            timestamp: new Date()
        });
    });
});

// Production Static Serving
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));
    
    app.get('*', (req, res) => {
        if (!req.path.startsWith('/api')) {
            res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'));
        }
    });
} else {
    app.get('/', (req, res) => {
        res.send('MEDI-CONNECT Secure API is running...');
    });
}

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`\n🚀 MEDI-CONNECT Server running on port ${PORT}`);
});
