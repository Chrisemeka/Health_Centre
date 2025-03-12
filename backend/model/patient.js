const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    dateOfBirth: Date,
    phone: String,
    nextOfKin: String,
    verificationToken: String,
    verified: { type: Boolean, default: false },
    resetPasswordToken : String,
    medicalRecords: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MedicalRecord' }]
});

module.exports = mongoose.model('Patient', patientSchema);
