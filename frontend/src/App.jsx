import { useState } from 'react'
import './App.css'

import { BrowserRouter as Router, Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
// Layouts
import LandingLayout from './components/layouts/LandingLayout';
import DoctorLayout from './components/layouts/DoctorLayout';
import PatientLayout from './components/layouts/PatientLayout';

// Landing Page
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import About from './pages/Landing/About';
import Contact from './pages/Landing/Contact';


//Doctor Page
import DoctorDashboard from './pages/doctor/Dashboard';
import PatientRecords from './pages/doctor/PatientRecords';
import DoctorAppointments from './pages/doctor/Appointments';

// Patient Page
import PatientDashboard from './pages/patient/Dashboard';
import PatientAppointments from './pages/patient/Appointments';
import MedicalRecords from './pages/patient/MedicalRecords';
import Profile from './pages/patient/Profile';
import Services from './pages/Landing/Services';



function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* public route */}
        <Route element={<LandingLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/services" element={<Services />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* doctor route */}
        <Route element={<DoctorLayout />}>
          <Route path="/doctor" element={<Navigate to="/doctor/dashboard" replace />} />
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor/appointments" element={<DoctorAppointments />} />
          <Route path="/doctor/patient-records" element={<PatientRecords />} />
        </Route>

        {/* patient route */}
        <Route element={<PatientLayout />}>
            <Route path="/patient" element={<Navigate to="/patient/dashboard" replace />} />
            <Route path="/patient/dashboard" element={<PatientDashboard />} />
            <Route path="/patient/appointments" element={<PatientAppointments />} />
            <Route path="/patient/medical-records" element={<MedicalRecords />} />
            <Route path="/patient/profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
