// models/MedicalRecord.js
const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
  patientId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Patient'  // <<< UPDATED to reference 'User' if your "Patient" is userType=patient 
  },
  doctorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Doctor'
  },

  // OLD fields (keep if still used):
  category: String,
  notes: String,
  fileUrl: String,

  // <<< NEW fields >>>
  recordType: { type: String },       // e.g. "Laboratory Results", "Prescription", etc.
  summary: { type: String },          // short summary
  details: { type: String },          // extended info
  documentUrl: { type: String },      // link to PDF or doc
  imageUrls: [{ type: String }],      // array of image links

  createdAt: { type: Date, default: Date.now },
  previousVersions: [{ type: Object }] // if you store version history
});

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);
