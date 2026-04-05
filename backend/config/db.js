const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.warn(`\n⚠️  DATABASE CONNECTION FAILED: ${err.message}`);
        console.warn('---------------------------------------------------------');
        console.warn('   Running in DEMO MODE with MemoryStore fallback.');
        console.warn('   To fix: Update MONGO_URI in backend/.env');
        console.warn('---------------------------------------------------------');
    }
};

module.exports = connectDB;
