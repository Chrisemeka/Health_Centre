import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';

const DoctorDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState('')
  const [stats, setStats] = useState({
    todayAppointments: 0,
    pendingAppointments: 0,
    totalPatients: 0,
    recentRecords: 0
  });
  
  // Today's appointments
  const [todayAppointments, setTodayAppointments] = useState([]);
  
  // Pending appointment requests
  const [pendingAppointments, setPendingAppointments] = useState([]);
  
  // Modal states
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [otpValue, setOtpValue] = useState('');
  const [otpError, setOtpError] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  
  // Reschedule form state
  const [rescheduleForm, setRescheduleForm] = useState({
    date: '',
    time: '',
    notes: ''
  });
  const [formErrors, setFormErrors] = useState({});
  
  // Quick patient search
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Set other data (user, stats, pending appointments, etc.)
  useEffect(() => {
    const userData = localStorage.getItem('doc');
    if (userData) {
      const userInfo = JSON.parse(userData);
      console.log(userInfo);
      setUser(userInfo);
    }
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      
      try {
        // Fetch appointments from the API
        const response = await api.get('/api/doctor/appointments');
        console.log('Appointments data:', response.data);
        const appointmentsData = response.data;
        
        // Get today's date in the same format as the API response
        const today = new Date().toISOString().split('T')[0];
        
        // Filter appointments for today
        const todayAppointments = appointmentsData.filter(appointment => {
          const appointmentDate = new Date(appointment.date).toISOString().split('T')[0];
          return appointmentDate === today;
        });

        // Filter appointments with the pending status
        const pendingAppointments = appointmentsData.filter(appointment => 
          appointment.status === "Pending" || !appointment.status
        );
        
        // Count confirmed appointments
        const confirmedAppointments = appointmentsData.filter(appointment => 
          appointment.status === "Confirmed" || appointment.status === "Checked In" || appointment.status === "Completed"
        );
        
        // Set today's appointments in state
        setTodayAppointments(todayAppointments);
        setPendingAppointments(pendingAppointments);
        
        // Fetch recent medical records count (use real API call)
        try {
          const recentRecordsResponse = await api.get('/api/doctor/records/recent');
          const recentRecordsCount = recentRecordsResponse.data.count || 0;
          
          // Update stats
          setStats({
            todayAppointments: todayAppointments.length,
            pendingAppointments: pendingAppointments.length,
            totalPatients: confirmedAppointments.length,
            recentRecords: recentRecordsCount
          });
        } catch (error) {
          console.error('Error fetching recent records count:', error);
          // If records API fails, still update the other stats
          setStats({
            todayAppointments: todayAppointments.length,
            pendingAppointments: pendingAppointments.length,
            totalPatients: confirmedAppointments.length,
            recentRecords: 0
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  // Search for patients
  useEffect(() => {
    if (searchTerm.length < 2) {
      setSearchResults([]);
      return;
    }
    
    const searchPatients = async () => {
      setIsSearching(true);
      
      try {
        // Make an API call to search for patients
        const response = await api.get(`/api/doctor/patients/search?query=${searchTerm}`);
        
        if (response.data) {
          setSearchResults(response.data);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error('Error searching patients:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };
    
    const debounceTimeout = setTimeout(() => {
      searchPatients();
    }, 300);
    
    return () => clearTimeout(debounceTimeout);
  }, [searchTerm]);

  const handleViewAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setIsViewModalOpen(true);
  };

  const handleConfirmAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setIsConfirmModalOpen(true);
  };

  const handleRescheduleAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    
    // Initialize reschedule form with the requested date and time
    setRescheduleForm({
      date: appointment.date || '',
      time: appointment.time || '',
      notes: ''
    });
    
    setIsRescheduleModalOpen(true);
  };

  const handleRescheduleFormChange = (e) => {
    const { name, value } = e.target;
    setRescheduleForm({
      ...rescheduleForm,
      [name]: value
    });
    
    // Clear any error for this field
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const handleViewRecords = async (patientId) => {
    setSelectedPatientId(patientId);
    setOtpValue('');
    setOtpError('');
    
    try {
      // Request OTP from the server
      const response = await api.post(`/api/doctor/patients/${patientId}/request-otp`);
      if (response.status === 200) {
        setIsOtpModalOpen(true);
      } else {
        setOtpError('Failed to request OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error requesting OTP:', error);
      setOtpError('Failed to request OTP. Please try again.');
    }
  };

  const handleOtpSubmit = async () => {
    if (!otpValue) {
      setOtpError('Please enter the OTP.');
      return;
    }
  
    try {
      // Validate OTP with the server
      const response = await api.post(`/api/doctor/patients/${selectedPatientId}/records`, { otp: otpValue });
      if (response.status === 200) {
        setIsOtpModalOpen(false);
        // Navigate to patient records
        window.location.href = `/doctor/patient-records?id=${selectedPatientId}`;
      } else {
        setOtpError('Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error validating OTP:', error);
      setOtpError('Invalid OTP. Please try again.');
    }
  };

  const handleOtpChange = (e) => {
    setOtpValue(e.target.value);
    if (otpError) {
      setOtpError('');
    }
  };

  const validateRescheduleForm = () => {
    const errors = {};
    
    if (!rescheduleForm.date) {
      errors.date = 'Date is required';
    }
    
    if (!rescheduleForm.time) {
      errors.time = 'Time is required';
    }
    
    return errors;
  };

  const confirmAppointmentRequest = async () => {
    try {
      // Update the appointment status to "Confirmed"
      await api.patch(`/api/doctor/appointments/${selectedAppointment._id}/status`, {
        status: 'Confirmed'
      });
      
      // Remove the appointment from pending requests
      setPendingAppointments(prevAppointments => 
        prevAppointments.filter(apt => apt._id !== selectedAppointment._id)
      );
      
      // Update the stats
      setStats(prevStats => ({
        ...prevStats,
        pendingAppointments: prevStats.pendingAppointments - 1,
        totalPatients: prevStats.totalPatients + 1 // Increment confirmed appointments count
      }));
      
      setIsConfirmModalOpen(false);
      alert('Appointment confirmed successfully.');
    } catch (error) {
      console.error('Error confirming appointment:', error);
      alert('Failed to confirm appointment. Please try again.');
    }
  };

  const submitReschedule = async (e) => {
    e.preventDefault();
    
    const errors = validateRescheduleForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    try {
      // API call to reschedule
      await api.patch(`/api/doctor/appointments/${selectedAppointment._id}/reschedule`, {
        date: rescheduleForm.date,
        time: rescheduleForm.time,
        notes: rescheduleForm.notes
      });
      
      // Remove the appointment from pending requests
      setPendingAppointments(prevAppointments => 
        prevAppointments.filter(apt => apt._id !== selectedAppointment._id)
      );
      
      // Update the stats
      setStats(prevStats => ({
        ...prevStats,
        pendingAppointments: prevStats.pendingAppointments - 1
      }));
      
      setIsRescheduleModalOpen(false);
      alert('Appointment rescheduled successfully.');
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      alert('Failed to reschedule appointment. Please try again.');
    }
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Doctor Dashboard</h1>
        <p className="text-sm text-gray-500">
          Welcome back, {user.firstName ? `${user.firstName} ${user.lastName}` : 'Doctor'}
        </p>
      </div>

      {/* Quick Search */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="relative">
          <label htmlFor="quickSearch" className="block text-sm font-medium text-gray-700">
            Quick Patient Search
          </label>
          <input
            id="quickSearch"
            type="text"
            placeholder="Search by patient name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
          />
          
          {searchTerm.length >= 2 && (
            <div className="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-md max-h-60 overflow-auto">
              {isSearching ? (
                <div className="flex justify-center items-center p-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-500"></div>
                </div>
              ) : searchResults.length > 0 ? (
                <ul className="py-1">
                  {searchResults.map((patient) => (
                    <li key={patient._id} className="px-4 py-2 hover:bg-gray-100">
                      <Link to={`/doctor/patient-records?id=${patient._id}`} className="flex flex-col">
                        <span className="font-medium text-gray-900">{patient.firstName} {patient.lastName}</span>
                        <span className="text-sm text-gray-500">
                          ID: {patient._id} | Email: {patient.email}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No patients found matching your search.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-teal-200 bg-opacity-30">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-teal-100">Today's Appointments</p>
              <p className="text-2xl font-semibold">{stats.todayAppointments}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-200 bg-opacity-30">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-yellow-100">Pending Requests</p>
              <p className="text-2xl font-semibold">{stats.pendingAppointments}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-200 bg-opacity-30">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-green-100">Confirmed Appointments</p>
              <p className="text-2xl font-semibold">{stats.totalPatients}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-200 bg-opacity-30">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-purple-100">Recent Records</p>
              <p className="text-2xl font-semibold">{stats.recentRecords}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Appointments */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Today's Appointments</h2>
          <Link to="/doctor/appointments">
            <button className="px-4 py-2 text-sm font-medium text-teal-600 bg-teal-50 rounded-md hover:bg-teal-100">
              View All Appointments
            </button>
          </Link>
        </div>
        
        {loading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
          </div>
        ) : todayAppointments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Purpose
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {todayAppointments.map((appointment) => (
                  <tr key={appointment._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {appointment.time || new Date(appointment.date).toLocaleTimeString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {appointment.patientName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {appointment.patientId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {appointment.purpose}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        appointment.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                        appointment.status === 'Checked In' ? 'bg-green-100 text-green-800' :
                        appointment.status === 'Completed' ? 'bg-gray-100 text-gray-800' :
                        appointment.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                        appointment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {appointment.status || 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewAppointment(appointment)}
                          className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleViewRecords(appointment.patientId)}
                          className="px-4 py-2 text-sm font-medium text-teal-600 bg-teal-50 rounded-md hover:bg-teal-100"
                        >
                          Records
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <p>No appointments scheduled for today.</p>
          </div>
        )}
      </div>

      {/* Pending Appointment Requests */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Pending Appointment Requests</h2>
        </div>
        
        {loading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
          </div>
        ) : pendingAppointments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Requested Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Requested Time
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Purpose
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingAppointments.map((appointment) => (
                  <tr key={appointment._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {appointment.patientName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {appointment.patientId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(appointment.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {appointment.time || new Date(appointment.date).toLocaleTimeString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {appointment.purpose}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleConfirmAppointment(appointment)}
                          className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => handleRescheduleAppointment(appointment)}
                          className="px-4 py-2 text-sm font-medium text-teal-600 bg-teal-50 rounded-md hover:bg-teal-100"
                        >
                          Reschedule
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <p>No pending appointment requests.</p>
          </div>
        )}
      </div>

      {/* View Appointment Modal */}
      {isViewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Appointment Details</h2>
            </div>
            <div className="p-6 space-y-4">
              {selectedAppointment && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Patient</p>
                      <p className="mt-1">{selectedAppointment.patientName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Patient ID</p>
                      <p className="mt-1">{selectedAppointment.patientId}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Date</p>
                      <p className="mt-1">{formatDate(selectedAppointment.date)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Time</p>
                      <p className="mt-1">{selectedAppointment.time || new Date(selectedAppointment.date).toLocaleTimeString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Status</p>
                      <p className="mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          selectedAppointment.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                          selectedAppointment.status === 'Checked In' ? 'bg-green-100 text-green-800' :
                          selectedAppointment.status === 'Completed' ? 'bg-gray-100 text-gray-800' :
                          selectedAppointment.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {selectedAppointment.status || 'Pending'}
                        </span>
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Purpose</p>
                    <p className="mt-1">{selectedAppointment.purpose}</p>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200 flex space-x-3">
                    <button
                      onClick={() => handleViewRecords(selectedAppointment.patientId)}
                      className="px-4 py-2 text-sm font-medium text-teal-600 bg-teal-50 rounded-md hover:bg-teal-100"
                    >
                      View Records
                    </button>
                    
                    {selectedAppointment.status === 'Confirmed' && (
                      <button 
                        onClick={async () => {
                          try {
                            await api.patch(`/api/doctor/appointments/${selectedAppointment._id}/status`, {
                              status: 'Checked In'
                            });
                            setIsViewModalOpen(false);
                            alert('Patient checked in successfully.');
                            // Refresh appointments data
                            window.location.reload();
                          } catch (error) {
                            console.error('Error checking in patient:', error);
                            alert('Failed to check in patient. Please try again.');
                          }
                        }}
                        className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                      >
                        Check In Patient
                      </button>
                    )}
                    
                    {selectedAppointment.status === 'Checked In' && (
                      <button 
                        onClick={async () => {
                          try {
                            await api.patch(`/api/doctor/appointments/${selectedAppointment._id}/status`, {
                              status: 'Completed'
                            });
                            setIsViewModalOpen(false);
                            alert('Appointment marked as completed.');
                            // Refresh appointments data
                            window.location.reload();
                          } catch (error) {
                            console.error('Error completing appointment:', error);
                            alert('Failed to complete appointment. Please try again.');
                          }
                        }}
                        className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                      >
                        Mark as Completed
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Appointment Modal */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Confirm Appointment</h2>
            </div>
            <div className="p-6 space-y-4">
              {selectedAppointment && (
                <>
                  <p className="text-gray-700">
                    Are you sure you want to confirm the appointment request from <span className="font-medium">{selectedAppointment.patientName}</span> for {formatDate(selectedAppointment.date)} at {selectedAppointment.time || new Date(selectedAppointment.date).toLocaleTimeString()}?
                  </p>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Purpose</p>
                    <p className="mt-1">{selectedAppointment.purpose}</p>
                  </div>
                  
                  {selectedAppointment.notes && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Notes</p>
                      <p className="mt-1">{selectedAppointment.notes}</p>
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmAppointmentRequest}
                className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700"
              >
                Confirm Appointment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Appointment Modal */}
      {isRescheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Reschedule Appointment</h2>
            </div>
            <form onSubmit={submitReschedule} className="p-6 space-y-4">
              {selectedAppointment && (
                <>
                  <p className="text-gray-700">
                    Propose a new time for <span className="font-medium">{selectedAppointment.patientName}</span>'s appointment.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                        New Date
                      </label>
                      <input
                        id="date"
                        name="date"
                        type="date"
                        value={rescheduleForm.date}
                        onChange={handleRescheduleFormChange}
                        className={`w-full px-3 py-2 border ${
                          formErrors.date ? 'border-red-500' : 'border-gray-300'
                        } rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm`}
                        min={new Date().toISOString().split('T')[0]} // Set min date to today
                      />
                      {formErrors.date && (
                        <p className="mt-2 text-sm text-red-600">{formErrors.date}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                        New Time
                      </label>
                      <input
                        id="time"
                        name="time"
                        type="time"
                        value={rescheduleForm.time}
                        onChange={handleRescheduleFormChange}
                        className={`w-full px-3 py-2 border ${
                          formErrors.time ? 'border-red-500' : 'border-gray-300'
                        } rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm`}
                      />
                      {formErrors.time && (
                        <p className="mt-2 text-sm text-red-600">{formErrors.time}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                      Notes for Patient
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                      placeholder="Explain why the appointment needs to be rescheduled..."
                      value={rescheduleForm.notes}
                      onChange={handleRescheduleFormChange}
                    />
                  </div>
                </>
              )}
            </form>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setIsRescheduleModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={submitReschedule}
                className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700"
              >
                Reschedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OTP Modal */}
      {isOtpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Enter OTP</h2>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-gray-700">
                An OTP has been sent to the patient. Please enter it below to access the records.
              </p>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otpValue}
                onChange={handleOtpChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              />
              {otpError && (
                <p className="text-sm text-red-600">{otpError}</p>
              )}
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setIsOtpModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleOtpSubmit}
                className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;