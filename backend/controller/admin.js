const Hospital = require("../model/hospital");
const Doctor = require("../model/doctor");
const User = require("../model/user");
const bcrypt = require("bcrypt");

// Register a hospital (Only Admins can register)
exports.registerHospital = async (req, res) => {
  try {
    // Check if the hospital already exists by email
    const hospitalExists = await Hospital.findOne({ email: req.body.email });
    if (hospitalExists) {
      return res.status(400).json({ message: "Hospital already exists" });
    }

    // <<< ADDED: Track which admin created this hospital >>>
    const newHospital = new Hospital({
      ...req.body,
      createdBy: req.user.id, // For stats: who created this hospital
    });
    await newHospital.save();

    res.status(201).json({
      message: "Hospital registered successfully",
      hospitalId: newHospital._id,
    });
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
    if (!hospital)
      return res.status(404).json({ message: "Hospital not found" });

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
    const numPatients = await User.countDocuments({
      hospitalId: id,
      userType: "patient",
    });

    res.status(200).json({ numDoctors, numPatients });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

/* ------------------------------------------------------------------
   NEW REQUIREMENTS FOR ADMIN:
   1) Create doctor form
   2) Show totals: 
      - total hospitals created by this admin
      - total patients across all those hospitals
      - total doctors across all those hospitals
   ------------------------------------------------------------------ */

/**
 * Create a doctor (POST):
 * usertype (doctor), firstName, lastName, email, phone, DOB, gender, address, password
 */
exports.createDoctor = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      DOB,
      gender,
      address,
      password,
      hospitalId,
    } = req.body;

    // Check if a doctor with this email already exists
    const existingDoc = await Doctor.findOne({ email });
    if (existingDoc) {
      return res.status(400).json({ message: "A doctor with this email already exists." });
    }


    // Create new doctor record
    const newDoc = new Doctor({
      hospitalId,         // Link to hospital if your schema requires it
      userType: "doctor", // If your Doctor model also keeps userType
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth: DOB,
      gender,
      address,
      password,
      status: "Active",   // or default
    });

    await newDoc.save();

    return res.status(201).json({
      message: "Doctor created successfully",
      doctor: newDoc,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

/**
 * Get totals:
 *  - total hospitals created by this admin
 *  - total patients across those hospitals
 *  - total doctors across those hospitals
 */
exports.getAdminStats = async (req, res) => {
  try {
    // 1) Find all hospitals that this admin created
    const hospitals = await Hospital.find({ createdBy: req.user.id }); 
    const totalHospitals = hospitals.length;

    // 2) Extract the hospital IDs to find related doctors/patients
    const hospitalIds = hospitals.map((h) => h._id);

    // 3) Count how many doctors belong to these hospitals
    const totalDoctors = await Doctor.countDocuments({
      hospitalId: { $in: hospitalIds },
    });

    // 4) Count how many patients belong to these hospitals
    const totalPatients = await User.countDocuments({
      hospitalId: { $in: hospitalIds },
      userType: "patient",
    });

    return res.status(200).json({
      totalHospitals,
      totalPatients,
      totalDoctors,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};
