const AccessLog = require('../model/accessLog');

// Middleware to log record access
async function logRecordAccess(req, res, next) {
    try {
        await AccessLog.create({
            patientId: req.user.id,
            doctorId: req.body.doctorId || 'Unknown',
            action: 'Viewed Medical Record',
            timestamp: new Date()
        });
        next();
    } catch (err) {
        console.error('Logging error:', err);
        next();
    }
}

module.exports = logRecordAccess;