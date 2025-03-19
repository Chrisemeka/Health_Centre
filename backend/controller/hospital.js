const Doctor = require("../model/doctor");


exports.hospitalLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find hospital by email
    const hospital = await hospital.findOne({ email });
    if (!hospital) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, hospital.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: hospital._id, role: "hospital" }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({ message: "Login successful", token, hospital });
  } catch (error) {
    res.status(500).json({ error: "Internal server error", details: error.message });
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
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
};
// Create a new doctor in the hospital
exports.createDoctor = async (req, res) => {
  try {
    const newDoctor = new Doctor({ ...req.body, hospitalId: req.user.hospitalId });
    await newDoctor.save();
    res.status(201).json({ message: "Doctor created successfully", doctorId: newDoctor._id });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all doctors in a hospital
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ hospitalId: req.user.hospitalId });
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get specific doctor details
exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update doctor details
exports.updateDoctor = async (req, res) => {
  try {
    const updatedDoctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedDoctor) return res.status(404).json({ message: "Doctor not found" });

    res.status(200).json(updatedDoctor);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Change doctor status (Active/Inactive)
exports.changeDoctorStatus = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    doctor.status = req.body.status;
    await doctor.save();

    res.status(200).json({ message: "Doctor status updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
