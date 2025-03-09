const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
    category: String,
    notes: String,
    fileUrl: String,
    createdAt: { type: Date, default: Date.now },
    previousVersions: [{ type: Object }]
});

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);
