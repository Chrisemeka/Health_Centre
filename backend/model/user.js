const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  dateOfBirth: { type: Date, required: false },
  gender: { type: String, default: "other", enum: ["Male", "Female", "other"] },
  phone: { type: String, required: false },
  address: { type: String, required: false },
  bloodType: { type: String, required: false },
  allergies: { type: String, default: "None" },
  nextOfKin: { type: String, required: false },
  nextOfKinRelation: { type: String, required: false },
  nextOfKinPhone: { type: String, required: false },
  userType: {
    type: String,
    enum: ["patient", "admin", "doctor", "superAdmin"],
    default: "patient",
  },
  verified: { type: Boolean, default: false },
  verificationToken: { type: String },
});

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("User", UserSchema);
