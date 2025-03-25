import React, { useState, useEffect } from 'react';
import api from '../../api';

const PatientAppointments = () => {
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Added state for doctors and hospitals data
  const [doctors, setDoctors] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  
  // New appointment form data
  const [requestForm, setRequestForm] = useState({
    doctorId: '',
    doctorName: '',
    hospitalId: '',
    hospitalName: '',
    date: '',
    time: '',
    purpose: '',
    notes: ''
  });
  
  // Form errors
  const [formErrors, setFormErrors] = useState({});

  // Helper to format dates
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Load doctors and hospitals data regardless of modal state
  // so we can use this data to populate appointment information
  const fetchDoctorsAndHospitals = async () => {
    try {
      setLoadingOptions(true);
      // Fetch doctors and hospitals in parallel
      const [doctorsResponse, hospitalsResponse] = await Promise.all([
        api.get('/api/patient/doctor'),
        api.get('/api/patient/hospitals')
      ]);
      
      const doctorsData = doctorsResponse.data || [];
      const hospitalsData = hospitalsResponse.data || [];
      
      setDoctors(doctorsData);
      setHospitals(hospitalsData);
      
      return {
        doctors: doctorsData,
        hospitals: hospitalsData
      };
    } catch (error) {
      console.error('Error fetching doctors and hospitals:', error);
      return { doctors: [], hospitals: [] };
    } finally {
      setLoadingOptions(false);
    }
  };

  const fetchAppointments = async () => {
    setLoading(true);
    
    try {
      // First get doctors and hospitals data to help with name lookups
      const { doctors, hospitals } = await fetchDoctorsAndHospitals();
      
      // Create a map for quick doctor lookup
      const doctorMap = {};
      doctors.forEach(doctor => {
        doctorMap[doctor._id] = {
          name: `${doctor.firstName} ${doctor.lastName}`,
          hospitalId: doctor.hospitalId
        };
      });
      
      // Create a map for quick hospital lookup
      const hospitalMap = {};
      hospitals.forEach(hospital => {
        hospitalMap[hospital._id] = hospital.name;
      });
  
      // Then fetch appointments
      const response = await api.get('/api/patient/appointments');
      
      // Process appointments to enhance them with full doctor and hospital names
      const processedAppointments = response.data.map(appointment => {
        // Get doctor info
        const doctorInfo = appointment.doctorId ? doctorMap[appointment.doctorId] : null;
        const doctorName = doctorInfo?.name || appointment.doctorName || 'Unknown Doctor';
        
        // Get hospital info - first try from doctor's hospitalId, then from appointment
        let hospitalName = 'Unknown Hospital';
        if (doctorInfo?.hospitalId) {
          hospitalName = hospitalMap[doctorInfo.hospitalId] || hospitalName;
        } else if (appointment.hospitalId) {
          hospitalName = hospitalMap[appointment.hospitalId] || hospitalName;
        } else if (appointment.hospitalName) {
          hospitalName = appointment.hospitalName;
        }
  
        return {
          ...appointment,
          doctorName,
          hospitalName,
          status: appointment.status || 'Pending',
          formattedDate: formatDate(appointment.date)
        };
      });
      
      setAppointments(processedAppointments);
      setFilteredAppointments(processedAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setErrorMessage('Failed to load appointments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch appointments (which also fetches doctors and hospitals)
    fetchAppointments();
  }, []);

  // Fetch doctors and hospitals when request modal opens - to ensure fresh data
  useEffect(() => {
    if (isRequestModalOpen) {
      setLoadingOptions(true);
      fetchDoctorsAndHospitals().then(() => {
        setLoadingOptions(false);
      });
    }
  }, [isRequestModalOpen]);

  useEffect(() => {
    // Filter appointments based on search term and status filter
    const filtered = appointments.filter(appointment => {
      const matchesSearch = searchTerm === '' || 
        (appointment.doctorName && appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (appointment.hospitalName && appointment.hospitalName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (appointment.purpose && appointment.purpose.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = filterStatus === 'all' || appointment.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    });
    
    setFilteredAppointments(filtered);
  }, [searchTerm, filterStatus, appointments]);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
  };

  const handleViewAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setIsViewModalOpen(true);
  };

  const handleCancelAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setIsCancelModalOpen(true);
  };

  const confirmCancelAppointment = async () => {
    if (!selectedAppointment || !selectedAppointment._id) {
      setErrorMessage('Appointment ID is missing. Please try again.');
      setIsCancelModalOpen(false);
      return;
    }

    setCancelLoading(true);
    
    try {
      // Make the API call to cancel the appointment
      const response = await api.delete(`/api/patient/appointments/${selectedAppointment._id}`, {
        status: 'Cancelled'
      });
      
      console.log('Cancel appointment response:', response);
      
      // Refresh the appointments list
      await fetchAppointments();
      
      // Close the modal and show success message
      setIsCancelModalOpen(false);
      setSuccessMessage('Appointment cancelled successfully.');
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      setErrorMessage('Failed to cancel appointment. Please try again.');
    } finally {
      setCancelLoading(false);
    }
  };

  const handleRequestFormChange = (e) => {
    const { name, value } = e.target;
    
    // Handle select changes for doctor and hospital
    if (name === 'doctorId' && value) {
      const selectedDoctor = doctors.find(doc => doc._id === value);
      setRequestForm({
        ...requestForm,
        doctorId: value,
        doctorName: selectedDoctor ? `${selectedDoctor.firstName} ${selectedDoctor.lastName}` : ''
      });
    } else if (name === 'hospitalId' && value) {
      const selectedHospital = hospitals.find(hosp => hosp._id === value);
      setRequestForm({
        ...requestForm,
        hospitalId: value,
        hospitalName: selectedHospital ? selectedHospital.name : ''
      });
    } else {
      setRequestForm({
        ...requestForm,
        [name]: value
      });
    }
    
    // Clear any error for this field
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const validateRequestForm = () => {
    const errors = {};
    
    if (!requestForm.doctorId) {
      errors.doctorId = 'Doctor selection is required';
    }
    
    if (!requestForm.hospitalId) {
      errors.hospitalId = 'Hospital selection is required';
    }
    
    if (!requestForm.date) {
      errors.date = 'Date is required';
    } else {
      const selectedDate = new Date(requestForm.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        errors.date = 'Date cannot be in the past';
      }
    }
    
    if (!requestForm.time) {
      errors.time = 'Time is required';
    }
    
    if (!requestForm.purpose.trim()) {
      errors.purpose = 'Purpose is required';
    }
    
    return errors;
  };

  const handleRequestAppointment = async (e) => {
    e.preventDefault();
    console.log("Form submission triggered");
    
    const errors = validateRequestForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    try {
      // Create payload matching your backend API structure
      const appointmentPayload = {
        doctorId: requestForm.doctorId,
        hospitalId: requestForm.hospitalId,
        doctorName: requestForm.doctorName,
        hospitalName: requestForm.hospitalName,
        date: requestForm.date,
        time: requestForm.time,
        purpose: requestForm.purpose,
        notes: requestForm.notes
      };
      
      console.log("Submitting appointment data:", appointmentPayload);
      
      // Make the actual API call
      const response = await api.post('/api/patient/appointments', appointmentPayload);
      console.log(response);

      // Reset form and close modal
      setRequestForm({
        doctorId: '',
        doctorName: '',
        hospitalId: '',
        hospitalName: '',
        date: '',
        time: '',
        purpose: '',
        notes: ''
      });
      setIsRequestModalOpen(false);
      
      // Refresh appointments list to show the new appointment
      await fetchAppointments();
      
      setSuccessMessage('Appointment request submitted successfully.');
    } catch (error) {
      console.error('Error requesting appointment:', error);
      setErrorMessage('Failed to submit appointment request. Please try again.');
    }
  };

  // Get unique appointment statuses for filter dropdown
  const appointmentStatuses = ['all', ...new Set(appointments.map(appointment => appointment.status).filter(Boolean))];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">Appointments</h1>
          <button
            onClick={() => setIsRequestModalOpen(true)}
            className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            Request Appointment
          </button>
        </div>

        {/* Success and Error Messages */}
        {successMessage && (
          <div className="mb-6 bg-green-50 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 bg-red-50 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Filters Section */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 md:items-end">
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                Search Appointments
              </label>
              <input
                id="search"
                type="text"
                placeholder="Search by doctor, hospital, or purpose..."
                value={searchTerm}
                onChange={handleSearch}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              />
            </div>
            <div className="md:w-1/4">
              <label htmlFor="appointmentStatus" className="block text-sm font-medium text-gray-700">
                Filter by Status
              </label>
              <select
                id="appointmentStatus"
                name="appointmentStatus"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                value={filterStatus}
                onChange={handleFilterChange}
              >
                {appointmentStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status === 'all' ? 'All Statuses' : status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Appointments Table */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Appointments</h2>
          {loading ? (
            <div className="flex justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
            </div>
          ) : filteredAppointments.length > 0 ? (
            <div className="overflow-y-auto" style={{ maxHeight: '500px' }}> {/* Added scroll container */}
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Doctor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hospital
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Purpose
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAppointments.map((appointment) => (
                    <tr key={appointment._id || appointment.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {appointment.doctorName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {appointment.hospitalName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {appointment.formattedDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {appointment.time}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {appointment.purpose}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          appointment.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                          appointment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          appointment.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                          appointment.status === 'Completed' ? 'bg-gray-100 text-gray-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {appointment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {/* Actions remain the same */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <p>No appointments found matching your search criteria.</p>
            </div>
          )}
        </div>

        {/* View Appointment Modal */}
        {isViewModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Appointment Details</h2>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {selectedAppointment && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Doctor</p>
                      <p className="mt-1">{selectedAppointment.doctorName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Status</p>
                      <p className="mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          selectedAppointment.status === 'Confirmed' || selectedAppointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          selectedAppointment.status === 'Pending' || selectedAppointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          selectedAppointment.status === 'Scheduled' || selectedAppointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                          selectedAppointment.status === 'Completed' || selectedAppointment.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {selectedAppointment.status}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Date</p>
                      <p className="mt-1">{selectedAppointment.formattedDate || formatDate(selectedAppointment.date)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Time</p>
                      <p className="mt-1">{selectedAppointment.time}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Purpose</p>
                    <p className="mt-1">{selectedAppointment.purpose}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Notes</p>
                    <p className="mt-1">{selectedAppointment.notes || 'No additional notes.'}</p>
                  </div>
                  
                  {(selectedAppointment.status === 'Pending' || selectedAppointment.status === 'pending' || 
                    selectedAppointment.status === 'Confirmed' || selectedAppointment.status === 'confirmed' || 
                    selectedAppointment.status === 'Scheduled' || selectedAppointment.status === 'scheduled') && (
                    <div className="pt-4 border-t border-gray-200">
                      <button
                        onClick={() => {
                          setIsViewModalOpen(false);
                          setIsCancelModalOpen(true);
                        }}
                        className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        Cancel Appointment
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Request Appointment Modal */}
        {isRequestModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Request New Appointment</h2>
                <button
                  onClick={() => setIsRequestModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {loadingOptions ? (
                <div className="flex justify-center p-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
                </div>
              ) : (
                <form onSubmit={handleRequestAppointment} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="doctorId" className="block text-sm font-medium text-gray-700">
                        Doctor
                      </label>
                      <select
                        id="doctorId"
                        name="doctorId"
                        value={requestForm.doctorId}
                        onChange={handleRequestFormChange}
                        className={`mt-1 block w-full px-3 py-2 border ${
                          formErrors.doctorId ? 'border-red-500' : 'border-gray-300'
                        } rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm`}
                        required
                      >
                        <option value="">Select a doctor</option>
                        {doctors.map((doctor) => (
                          <option key={doctor._id} value={doctor._id}>
                            {doctor.firstName + ' ' + doctor.lastName}
                          </option>
                        ))}
                      </select>
                      {formErrors.doctorId && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.doctorId}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="hospitalId" className="block text-sm font-medium text-gray-700">
                        Hospital
                      </label>
                      <select
                        id="hospitalId"
                        name="hospitalId"
                        value={requestForm.hospitalId}
                        onChange={handleRequestFormChange}
                        className={`mt-1 block w-full px-3 py-2 border ${
                          formErrors.hospitalId ? 'border-red-500' : 'border-gray-300'
                        } rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm`}
                        required
                      >
                        <option value="">Select a hospital</option>
                        {hospitals.map((hospital) => (
                          <option key={hospital._id} value={hospital._id}>
                            {hospital.name}
                          </option>
                        ))}
                      </select>
                      {formErrors.hospitalId && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.hospitalId}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                        Date
                      </label>
                      <input
                        id="date"
                        type="date"
                        name="date"
                        value={requestForm.date}
                        onChange={handleRequestFormChange}
                        className={`mt-1 block w-full px-3 py-2 border ${
                          formErrors.date ? 'border-red-500' : 'border-gray-300'
                        } rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm`}
                        required
                        min={new Date().toISOString().split('T')[0]} // Set min date to today
                      />
                      {formErrors.date && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.date}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                        Time
                      </label>
                      <input
                        id="time"
                        type="time"
                        name="time"
                        value={requestForm.time}
                        onChange={handleRequestFormChange}
                        className={`mt-1 block w-full px-3 py-2 border ${
                          formErrors.time ? 'border-red-500' : 'border-gray-300'
                        } rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm`}
                        required
                      />
                      {formErrors.time && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.time}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="purpose" className="block text-sm font-medium text-gray-700">
                      Purpose of Visit <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="purpose"
                      name="purpose"
                      type="text"
                      value={requestForm.purpose}
                      onChange={handleRequestFormChange}
                      className={`mt-1 block w-full px-3 py-2 border ${
                        formErrors.purpose ? 'border-red-500' : 'border-gray-300'
                      } rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm`}
                      placeholder="E.g., Regular checkup, Consultation, Follow-up"
                      required
                    />
                    {formErrors.purpose && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.purpose}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                      Additional Notes
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows={3}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                      placeholder="Any additional information for the doctor"
                      value={requestForm.notes}
                      onChange={handleRequestFormChange}
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setIsRequestModalOpen(false)}
                      className="px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      Submit Request
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Cancel Appointment Modal */}
        {isCancelModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Cancel Appointment</h2>
                <button
                  onClick={() => setIsCancelModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {selectedAppointment && (
                <div className="space-y-4">
                  <p className="text-gray-700">
                    Are you sure you want to cancel your appointment with {selectedAppointment.doctorName} on {selectedAppointment.formattedDate || formatDate(selectedAppointment.date)} at {selectedAppointment.time}?
                  </p>
                  
                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => setIsCancelModalOpen(false)}
                      className="px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                      disabled={cancelLoading}
                    >
                      No, Keep It
                    </button>
                    <button
                      onClick={confirmCancelAppointment}
                      className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center"
                      disabled={cancelLoading}
                    >
                      {cancelLoading ? (
                        <>
                          <div className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full"></div>
                          <span>Cancelling...</span>
                        </>
                      ) : (
                        'Yes, Cancel It'
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientAppointments;