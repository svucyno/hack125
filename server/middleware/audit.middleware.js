const AuditLog = require('../models/AuditLog');

/**
 * Middleware to log PHI access and other sensitive actions.
 * @param {string} action - Action name (e.g., 'view_record')
 * @param {string} resource - Resource name (e.g., 'MedicalRecord')
 */
const auditLog = (action, resource) => {
    return async (req, res, next) => {
        // We log after the response is sent if successful
        res.on('finish', async () => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                try {
                    await AuditLog.create({
                        user: req.user ? req.user._id : null,
                        action,
                        resource,
                        details: `User ${req.user ? req.user.email : 'unknown'} performed ${action} on ${resource} (${req.params.id || 'bulk'})`,
                        ipAddress: req.ip,
                        userAgent: req.get('User-Agent')
                    });
                } catch (error) {
                    console.error('Audit Log Error:', error.message);
                }
            }
        });
        next();
    };
};

module.exports = { auditLog };
