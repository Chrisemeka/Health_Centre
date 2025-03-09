const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
    date: Date,
    status: { type: String, default: 'Pending' }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
