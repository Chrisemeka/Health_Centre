import './App.css'

import { BrowserRouter as Router, Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
// Layouts
import LandingLayout from './components/layouts/LandingLayout';
import DoctorLayout from './components/layouts/DoctorLayout';
import PatientLayout from './components/layouts/PatientLayout';

// Landing Page
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import DoctorLogin from './pages/auth/DoctorLogin';
import AdminLogin from './pages/auth/AdminLogin';
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

// Error 404
import Error404 from './pages/Error404';

// Super Admin
import SuperAdminDashboard from './pages/super/Dashboard';
import SuperAdminLayout from './components/layouts/SuperAdminLayout';
import HospitalRegistration from './pages/admin/Hospital';
import AdminDashboard from './pages/admin/Dashboard';
import AdminLayout from './components/layouts/AdminLayout';
import CreateUser from './pages/super/CreateUser';
import SystemLogs from './pages/admin/SystemLogs';
import CreateDoctor from './pages/admin/CreateDoctor';
import Logout from './pages/auth/Logout';



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
          <Route path="/doctor/login" element={<DoctorLogin />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="*" element={<Error404 />} />
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

        {/* Super admin route */}
        <Route element={<SuperAdminLayout />}>
          <Route path="/superadmin" element={<Navigate to="/superadmin/dashboard" replace />} />
          <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />
          <Route path="/superadmin/create-user" element={<CreateUser />} />
        </Route>

        {/* Admin route */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/system-logs" element={<SystemLogs />} />
          <Route path="/admin/hospitals" element={<HospitalRegistration />} />
          <Route path="/admin/create-doctor" element={<CreateDoctor />} />
        </Route>
      </Routes>

      
    </BrowserRouter>
  )
}

export default App
