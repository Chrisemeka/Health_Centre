// models/Doctor.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const DoctorSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true },

  specialty:      { type: String, required: false },
  phone:          { type: String, required: true },
  licenseNumber:  { type: String, required: false, unique: true },
  gender:         { type: String, required: true, enum: ["Male", "Female", "Other"] },
  department:     { type: String, required: false },
  hospitalId:     { type: mongoose.Schema.Types.ObjectId, ref: "Hospital", required: true },

  // <<< ADDED if needed >>>
  DOB:     { type: Date },
  address: { type: String },

  status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
});

// Hash password before saving
DoctorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("Doctor", DoctorSchema);
