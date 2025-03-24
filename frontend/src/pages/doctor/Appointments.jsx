import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';

const DoctorAppointments = () => {
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateRange, setDateRange] = useState('upcoming');
  const [updateLoading, setUpdateLoading] = useState(false);
  const [noteLoading, setNoteLoading] = useState(false);
  
  // Update form data
  const [updateForm, setUpdateForm] = useState({
    status: '',
    notes: ''
  });
  
  // Form for adding medical note
  const [noteForm, setNoteForm] = useState({
    note: ''
  });
  
  // Form errors
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // Status colors mapping for consistent use throughout the component
  const statusColors = {
    'Pending': 'bg-yellow-100 text-yellow-800',
    'pending': 'bg-yellow-100 text-yellow-800',
    'Confirmed': 'bg-green-100 text-green-800',
    'confirmed': 'bg-green-100 text-green-800',
    'Canceled': 'bg-red-100 text-red-800',
    'canceled': 'bg-red-100 text-red-800'
  };

  // Function to get status color based on status
  const getStatusColor = (status) => {
    if (!status) return statusColors['Pending']; // Default to Pending if status is undefined or null
    
    const normalizedStatus = status.toLowerCase();
    
    if (normalizedStatus.includes('confirm')) {
      return statusColors['Confirmed'];
    } else if (normalizedStatus.includes('cancel')) {
      return statusColors['Canceled'];
    } else if (normalizedStatus.includes('pending')) {
      return statusColors['Pending'];
    } else {
      return statusColors['Pending']; // Default case
    }
  };

  // Function to normalize status display
  const normalizeStatusDisplay = (status) => {
    if (!status) return 'Pending';
    
    const normalizedStatus = status.toLowerCase();
    
    if (normalizedStatus.includes('confirmed')) {
      return 'Confirmed';
    } else if (normalizedStatus.includes('cancel')) {
      return 'Canceled';
    } else if (normalizedStatus.includes('pending')) {
      return 'Pending';
    } else {
      return 'Pending';
    }
  };

  // Format date to a user-friendly format
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    
    try {
      const response = await api.get('/api/doctor/appointments');
      console.log('API Response:', response);
      
      // Assuming your response has a data property containing the appointments array
      const appointmentsData = response.data;
      console.log('Appointments data:', appointmentsData);
      
      setAppointments(appointmentsData);
      setFilteredAppointments(appointmentsData);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Filter appointments based on search term, date filter, and status filter
    if (!appointments.length) return;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const filtered = appointments.filter(appointment => {
      // Search filter
      const patientName = appointment.patientName || '';
      const patientId = appointment.patientId || '';
      const purpose = appointment.purpose || '';
      
      const matchesSearch = searchTerm === '' || 
        patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patientId.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        purpose && purpose.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Date filter
      let matchesDate = true;
      if (filterDate) {
        const appointmentDate = new Date(appointment.date);
        const selectedDate = new Date(filterDate);
        matchesDate = appointmentDate.toDateString() === selectedDate.toDateString();
      } else if (dateRange === 'today') {
        const appointmentDate = new Date(appointment.date);
        appointmentDate.setHours(0, 0, 0, 0);
        matchesDate = appointmentDate.getTime() === today.getTime();
      } else if (dateRange === 'upcoming') {
        const appointmentDate = new Date(appointment.date);
        appointmentDate.setHours(0, 0, 0, 0);
        matchesDate = appointmentDate.getTime() >= today.getTime();
      } else if (dateRange === 'past') {
        const appointmentDate = new Date(appointment.date);
        appointmentDate.setHours(0, 0, 0, 0);
        matchesDate = appointmentDate.getTime() < today.getTime();
      }
      
      // Status filter
      let matchesStatus = true;
      if (filterStatus !== 'all') {
        const appointmentStatus = appointment.status ? appointment.status.toLowerCase() : 'pending';
        matchesStatus = (
          (filterStatus === 'Pending' && appointmentStatus.includes('pending')) ||
          (filterStatus === 'Confirmed' && appointmentStatus.includes('confirm')) ||
          (filterStatus === 'Canceled' && appointmentStatus.includes('cancel'))
        );
      }
      
      return matchesSearch && matchesDate && matchesStatus;
    });
    
    setFilteredAppointments(filtered);
  }, [searchTerm, filterDate, filterStatus, dateRange, appointments]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterDateChange = (e) => {
    setFilterDate(e.target.value);
    // If a specific date is selected, clear the date range filter
    if (e.target.value) {
      setDateRange('custom');
    }
  };

  const handleFilterStatusChange = (e) => {
    setFilterStatus(e.target.value);
  };

  const handleDateRangeChange = (e) => {
    setDateRange(e.target.value);
    // Clear the specific date filter when a date range is selected
    if (e.target.value !== 'custom') {
      setFilterDate('');
    }
  };

  const handleViewAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setIsViewModalOpen(true);
  };

  const handleUpdateAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    
    // Initialize form with current values
    setUpdateForm({
      status: normalizeStatusDisplay(appointment.status),
      notes: appointment.notes || ''
    });
    
    setFormErrors({});
    setIsUpdateModalOpen(true);
  };

  const handleAddMedicalNote = (appointment) => {
    setSelectedAppointment(appointment);
    setNoteForm({ note: appointment.medicalNotes || '' });
    setFormErrors({});
    setIsAddNoteModalOpen(true);
  };

  const handleUpdateFormChange = (e) => {
    const { name, value } = e.target;
    setUpdateForm({
      ...updateForm,
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

  const handleNoteFormChange = (e) => {
    const { name, value } = e.target;
    setNoteForm({
      ...noteForm,
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

  const validateUpdateForm = () => {
    const errors = {};
    
    if (!updateForm.status) {
      errors.status = 'Status is required';
    }
    
    return errors;
  };

  const validateNoteForm = () => {
    const errors = {};
    
    if (!noteForm.note.trim()) {
      errors.note = 'Medical note is required';
    }
    
    return errors;
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateUpdateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setUpdateLoading(true);
    
    try {
      // Make API call to update appointment
      const updatedData = {
        status: updateForm.status,
        notes: updateForm.notes,
        id: selectedAppointment._id
      };
      
      const response = await api.put(`/api/doctor/appointments/${selectedAppointment._id}`, updatedData);
      console.log('Update response:', response);
      
      // Update the appointment in the list
      const updatedAppointments = appointments.map(apt => {
        if (apt._id === selectedAppointment._id) {
          return {
            ...apt,
            status: updateForm.status,
            notes: updateForm.notes
          };
        }
        return apt;
      });
      
      setAppointments(updatedAppointments);
      
      // Close modal and show success message
      setIsUpdateModalOpen(false);
      setSuccessMessage('Appointment updated successfully.');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error updating appointment:', error);
      setFormErrors({
        general: 'Failed to update appointment. Please try again.'
      });
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleAddNoteSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateNoteForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setNoteLoading(true);
    
    try {
      // Make API call to update medical notes using the correct endpoint
      const updatedData = {
        notes: noteForm.note,
      };
      
      // Use the correct endpoint for medical notes
      const response = await api.post(`/api/doctor/appointments/${selectedAppointment._id}/notes`, updatedData);
      console.log('Medical note update response:', response);
      
      // Update the appointment in the list
      const updatedAppointments = appointments.map(apt => {
        if (apt._id === selectedAppointment._id) {
          return {
            ...apt,
            medicalNotes: noteForm.note
          };
        }
        return apt;
      });
      
      setAppointments(updatedAppointments);
      
      // Close modal and show success message
      setIsAddNoteModalOpen(false);
      setSuccessMessage('Medical note added successfully.');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error adding medical note:', error);
      setFormErrors({
        general: 'Failed to add medical note. Please try again.'
      });
    } finally {
      setNoteLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">Doctor Appointments</h1>
        </div>
        
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

        {/* Filters Section */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                Search
              </label>
              <input
                id="search"
                type="text"
                placeholder="Search by patient name or ID..."
                value={searchTerm}
                onChange={handleSearch}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700">
                Date Range
              </label>
              <select
                id="dateRange"
                value={dateRange}
                onChange={handleDateRangeChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              >
                <option value="upcoming">Upcoming</option>
                <option value="today">Today</option>
                <option value="past">Past</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="filterDate" className="block text-sm font-medium text-gray-700">
                Specific Date
              </label>
              <input
                id="filterDate"
                type="date"
                value={filterDate}
                onChange={handleFilterDateChange}
                disabled={dateRange !== 'custom'}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="filterStatus" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="filterStatus"
                value={filterStatus}
                onChange={handleFilterStatusChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              >
                <option value="all">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Canceled">Canceled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Appointments Table */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Appointments</h2>
          {loading ? (
            <div className="flex justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
            </div>
          ) : filteredAppointments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient ID
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
                    <tr key={appointment._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(appointment.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {appointment.time || 'Not Specified'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {appointment.patientName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {appointment.patientId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {appointment.purpose || 'Not Specified'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                          {normalizeStatusDisplay(appointment.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewAppointment(appointment)}
                            className="px-3 py-1 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleUpdateAppointment(appointment)}
                            className="px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                          >
                            Update
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
                <div className="space-y-6">
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
                      <p className="mt-1">{selectedAppointment.time || 'Not Specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Purpose</p>
                      <p className="mt-1">{selectedAppointment.purpose || 'Not Specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Status</p>
                      <p className="mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedAppointment.status)}`}>
                          {normalizeStatusDisplay(selectedAppointment.status)}
                        </span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <Link to={`/doctor/patient-records?id=${selectedAppointment.patientId}`}>
                      <button className="px-3 py-1 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500">
                        View Patient Records
                      </button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Update Appointment Modal */}
        {isUpdateModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Update Appointment</h2>
                <button
                  onClick={() => setIsUpdateModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {selectedAppointment && (
                <form onSubmit={handleUpdateSubmit} className="space-y-4">
                  {formErrors.general && (
                    <div className="bg-red-50 p-4 rounded-md">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800">{formErrors.general}</h3>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Patient: {selectedAppointment.patientName} ({selectedAppointment.patientId})
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      {formatDate(selectedAppointment.date)} at {selectedAppointment.time || 'Not Specified'} 
                      {selectedAppointment.purpose ? ` - ${selectedAppointment.purpose}` : ''}
                    </p>
                  </div>
                  
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="status"
                      name="status"
                      className={`mt-1 block w-full px-3 py-2 border ${
                        formErrors.status ? 'border-red-500' : 'border-gray-300'
                      } rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm`}
                      value={updateForm.status}
                      onChange={handleUpdateFormChange}
                      required
                    >
                      <option value="">Select a status</option>
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Canceled">Canceled</option>
                    </select>
                    {formErrors.status && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.status}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                      Appointment Notes
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows={3}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                      placeholder="Any notes about this appointment..."
                      value={updateForm.notes}
                      onChange={handleUpdateFormChange}
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setIsUpdateModalOpen(false)}
                      className="px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={updateLoading}
                      className="px-3 py-1 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 flex items-center"
                    >
                      {updateLoading ? (
                        <>
                          <div className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full"></div>
                          <span>Updating...</span>
                        </>
                      ) : 'Update Appointment'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Add Medical Note Modal */}
        {isAddNoteModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Medical Notes</h2>
                <button
                  onClick={() => setIsAddNoteModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {selectedAppointment && (
                <form onSubmit={handleAddNoteSubmit} className="space-y-4">
                  {formErrors.general && (
                    <div className="bg-red-50 p-4 rounded-md">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800">{formErrors.general}</h3>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Patient: {selectedAppointment.patientName} ({selectedAppointment.patientId})
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      {formatDate(selectedAppointment.date)} at {selectedAppointment.time || 'Not Specified'}
                      {selectedAppointment.purpose ? ` - ${selectedAppointment.purpose}` : ''}
                    </p>
                  </div>
                  
                  <div>
                    <label htmlFor="note" className="block text-sm font-medium text-gray-700">
                      Medical Notes <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="note"
                      name="note"
                      rows={6}
                      className={`mt-1 block w-full px-3 py-2 border ${
                        formErrors.note ? 'border-red-500' : 'border-gray-300'
                      } rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm`}
                      placeholder="Enter detailed medical notes about this appointment..."
                      value={noteForm.note}
                      onChange={handleNoteFormChange}
                      required
                    />
                    {formErrors.note && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.note}</p>
                    )}
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setIsAddNoteModalOpen(false)}
                      className="px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={noteLoading}
                      className="px-3 py-1 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 flex items-center"
                    >
                      {noteLoading ? (
                        <>
                          <div className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full"></div>
                          <span>Saving...</span>
                        </>
                      ) : 'Save Medical Notes'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorAppointments;