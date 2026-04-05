// Memory store to catch requests when MongoDB is down
class MemoryStore {
    constructor() {
        this.users = [];
        this.records = [];
        this.auditLogs = [];
    }

    async findUserByEmail(email) {
        return this.users.find(u => u.email === email);
    }

    async createUser(userData) {
        const newUser = { ...userData, _id: Date.now().toString(), isVerified: userData.role === 'doctor' ? false : true };
        // Simulate password comparison method for mock users
        newUser.comparePassword = async function(pass) { return pass === this.password; };
        newUser.save = async function() { return this; };
        this.users.push(newUser);
        return newUser;
    }

    async findUserById(id) {
        return this.users.find(u => u._id === id);
    }

    async getAllUsers() {
        return this.users;
    }

    async createRecord(recordData) {
        const newRecord = { ...recordData, _id: Date.now().toString(), createdAt: new Date() };
        this.records.push(newRecord);
        return newRecord;
    }

    async getRecordsByPatient(patientId) {
        return this.records.filter(r => r.patient === patientId);
    }
}

module.exports = new MemoryStore();
