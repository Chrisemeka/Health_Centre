const Hospital = require("../model/hospital");
const Doctor = require("../model/doctor");
const User = require("../model/user");

// Register a hospital (Only Admins can register)
exports.registerHospital = async (req, res) => {
  try {
    const hospitalExists = await Hospital.findOne({ email: req.body.email });
    if (hospitalExists) return res.status(400).json({ message: "Hospital already exists" });

    const newHospital = new Hospital(req.body);
    await newHospital.save();

    res.status(201).json({ message: "Hospital registered successfully", hospitalId: newHospital._id });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all hospitals
exports.getAllHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find({ status: "Active" });
    res.status(200).json(hospitals);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get specific hospital details
exports.getHospitalById = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) return res.status(404).json({ message: "Hospital not found" });

    res.status(200).json(hospital);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get hospital stats (Doctors & Patients count)
exports.getHospitalStats = async (req, res) => {
  try {
    const { id } = req.params;

    const numDoctors = await Doctor.countDocuments({ hospitalId: id });
    const numPatients = await User.countDocuments({ hospitalId: id, userType: "patient" });

    res.status(200).json({ numDoctors, numPatients });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
