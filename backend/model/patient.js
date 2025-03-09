const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const medicalRecordSchema = new Schema({
    recordType: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true }
});

const patientSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, required: true },
    contactNumber: { type: String, required: true },
    address: { type: String, required: true },
    medicalRecords: [medicalRecordSchema]
});

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;