import React, { useState, useEffect } from 'react';
import api from '../../api';

const PatientAppointments = () => {
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
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

  useEffect(() => {
    // Fetch appointments
    const fetchAppointments = async () => {
      setLoading(true);
      
      try {
        const response = await api.get('/api/patient/appointments');
        console.log('Fetched appointments:', response.data);
        
        // Make sure all appointments have a status property for filtering
        const processedAppointments = response.data.map(appointment => ({
          ...appointment,
          status: appointment.status || 'Pending' // Default to 'Pending' if status is missing
        }));
        
        setAppointments(processedAppointments);
        setFilteredAppointments(processedAppointments);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAppointments();
  }, []);

  // Fetch doctors and hospitals when request modal opens
  useEffect(() => {
    if (isRequestModalOpen) {
      const fetchOptions = async () => {
        setLoadingOptions(true);
        try {
          // Fetch doctors and hospitals in parallel
          const [doctorsResponse, hospitalsResponse] = await Promise.all([
            api.get('/api/patient/doctor'),
            api.get('/api/patient/hospitals')
          ]);
          
          setDoctors(doctorsResponse.data);
          setHospitals(hospitalsResponse.data);

          console.log(doctorsResponse.data, hospitalsResponse.data);
        } catch (error) {
          console.error('Error fetching options:', error);
        } finally {
          setLoadingOptions(false);
        }
      };
      
      fetchOptions();
    }
  }, [isRequestModalOpen]);

  useEffect(() => {
    // Filter appointments based on search term and status filter
    const filtered = appointments.filter(appointment => {
      const matchesSearch = searchTerm === '' || 
        (appointment.doctorId && appointment.doctorId.toString().toLowerCase().includes(searchTerm.toLowerCase())) ||
        (appointment.doctorName && appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (appointment.hospitalId && appointment.hospitalId.toString().toLowerCase().includes(searchTerm.toLowerCase())) ||
        (appointment.hospitalName && appointment.hospitalName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (appointment.purpose && appointment.purpose.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = filterStatus === 'all' || appointment.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    });
    
    setFilteredAppointments(filtered);
  }, [searchTerm, filterStatus, appointments]);

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
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update the local state
      setAppointments(appointments.map(apt => 
        apt.id === selectedAppointment.id ? { ...apt, status: 'Cancelled' } : apt
      ));
      
      setIsCancelModalOpen(false);
      alert('Appointment cancelled successfully.');
    } catch (error) {
      console.error('Error cancelling appointment:', error);
    }
  };

  const handleRequestFormChange = (e) => {
    const { name, value } = e.target;
    
    // Handle select changes for doctor and hospital
    if (name === 'doctorId' && value) {
      const selectedDoctor = doctors.find(doc => doc.id === value);
      setRequestForm({
        ...requestForm,
        doctorId: value,
        doctorName: selectedDoctor ? selectedDoctor.name : ''
      });
    } else if (name === 'hospitalId' && value) {
      const selectedHospital = hospitals.find(hosp => hosp.id === value);
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
      const updatedAppointments = await api.get('/api/patient/appointments');
      setAppointments(updatedAppointments.data);
      setFilteredAppointments(updatedAppointments.data);
      
      alert('Appointment request submitted successfully.');
    } catch (error) {
      console.error('Error requesting appointment:', error);
      alert('Failed to submit appointment request.');
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
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doctor
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hospital
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Purpose
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAppointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {appointment.doctorName || appointment.doctorId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {appointment.hospitalName || appointment.hospital}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {appointment.date}
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
                      <div className="flex space-x-2">
                        {(appointment.status === 'Pending' || appointment.status === 'Confirmed' || appointment.status === 'Scheduled') && (
                          <button
                            onClick={() => handleCancelAppointment(appointment)}
                            className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <p>No appointments found matching your search criteria.</p>
            </div>
          )}
        </div>

        {/* View Appointment Modal */}
        {isViewModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
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
                      <p className="mt-1">{selectedAppointment.doctorName || selectedAppointment.doctorId}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Hospital</p>
                      <p className="mt-1">{selectedAppointment.hospitalName || selectedAppointment.hospital}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Status</p>
                      <p className="mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          selectedAppointment.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                          selectedAppointment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          selectedAppointment.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                          selectedAppointment.status === 'Completed' ? 'bg-gray-100 text-gray-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {selectedAppointment.status}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Date</p>
                      <p className="mt-1">{selectedAppointment.date}</p>
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
                  
                  {(selectedAppointment.status === 'Pending' || selectedAppointment.status === 'Confirmed' || selectedAppointment.status === 'Scheduled') && (
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
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
                          <option key={doctor.id} value={doctor.id}>
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
                          <option key={hospital.id} value={hospital.id}>
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
                      Purpose
                    </label>
                    <input
                      id="purpose"
                      type="text"
                      name="purpose"
                      placeholder="Purpose of the appointment"
                      value={requestForm.purpose}
                      onChange={handleRequestFormChange}
                      className={`mt-1 block w-full px-3 py-2 border ${
                        formErrors.purpose ? 'border-red-500' : 'border-gray-300'
                      } rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm`}
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
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
                    Are you sure you want to cancel your appointment with {selectedAppointment.doctorName || selectedAppointment.doctorId} on {selectedAppointment.date} at {selectedAppointment.time}?
                  </p>
                  
                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => setIsCancelModalOpen(false)}
                      className="px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      No, Keep It
                    </button>
                    <button
                      onClick={confirmCancelAppointment}
                      className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      Yes, Cancel It
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