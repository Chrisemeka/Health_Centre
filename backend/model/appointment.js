const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
    medicalNotes: { type: String },
    date: Date,
    status: { type: String, default: 'Pending' }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
