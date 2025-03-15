const mongoose = require("mongoose");

const DoctorSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  specialty: { type: String, required: true },
  phone: { type: String, required: true },
  licenseNumber: { type: String, required: true, unique: true },
  gender: { type: String, required: true, enum: ["Male", "Female", "Other"] },
  department: { type: String, required: true },
  hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: "Hospital", required: true },
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
});

module.exports = mongoose.model("Doctor", DoctorSchema);
