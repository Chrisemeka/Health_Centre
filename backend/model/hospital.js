const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const HospitalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // 🔹 Required for login
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },

    // Hospital Admin Details
    adminName: { type: String, required: true },
    adminEmail: { type: String, required: true },
    adminPhone: { type: String, required: true },

    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },

    // Role-Based Authentication (Optional)
    role: { type: String, enum: ["hospital"], default: "hospital" },
  },
  { timestamps: true }
);

// 🔹 Hash password before saving to DB
HospitalSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("Hospital", HospitalSchema);
