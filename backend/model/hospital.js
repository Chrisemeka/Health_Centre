const mongoose = require("mongoose");

const HospitalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  adminName: { type: String, required: true },
  adminEmail: { type: String, required: true },
  adminPhone: { type: String, required: true },
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
});

module.exports = mongoose.model("Hospital", HospitalSchema);
