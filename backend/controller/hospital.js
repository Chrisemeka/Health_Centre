const hospital = require("../model/hospital");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const doctor = require("../model/doctor");

exports.hospitalLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Find hospital by email
    const hos = await hospital.findOne({ email });
    if (!hos) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    
    const isMatch = await bcrypt.compare(password, hos.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: hos._id, role: "hospital" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ message: "Login successful", token, hos });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};

// 🔹 Get Hospital Profile (Protected Route)
exports.getHospitalProfile = async (req, res) => {
  try {
    const hospital = await hospital.findById(req.user.id).select("-password");
    if (!hospital) {
      return res.status(404).json({ error: "Hospital not found" });
    }

    res.status(200).json({ hospital });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};
// Create a new doctor in the hospital
exports.createDoctor = async (req, res) => {
  try {
    const newDoctor = new doctor({ ...req.body, hospitalId: req.user.id });
    await newDoctor.save();
    res
      .status(201)
      .json({
        message: "Doctor created successfully",
        doctorId: newDoctor._id,
      });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all doctors in a hospital
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await doctor.find({ hospitalId: req.user.id });
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get specific doctor details
exports.getDoctorById = async (req, res) => {
  try {
    const doctors = await doctor.findById(req.params.id);
    if (!doctors) return res.status(404).json({ message: "Doctor not found" });

    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update doctor details
exports.updateDoctor = async (req, res) => {
  try {
    const updatedDoctor = await doctor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedDoctor)
      return res.status(404).json({ message: "Doctor not found" });

    res.status(200).json(updatedDoctor);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Change doctor status (Active/Inactive)
exports.changeDoctorStatus = async (req, res) => {
  try {
    const changeDoctor = await doctor.findById(req.params.id);
    if (!changeDoctor)
      return res.status(404).json({ message: "Doctor not found" });
    changeDoctor.status = req.body.status;
    await changeDoctor.save();

    res.status(200).json({ message: "Doctor status updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
