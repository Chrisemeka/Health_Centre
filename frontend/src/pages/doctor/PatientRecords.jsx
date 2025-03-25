import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../api';

const PatientRecords = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract patient ID from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const patientId = queryParams.get('id');
  
  // Main state variables
  const [loading, setLoading] = useState(true);
  const [patientLoading, setPatientLoading] = useState(true);
  const [patientData, setPatientData] = useState(null);
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // View record state
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  
  // OTP verification state
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [isRequestingOtp, setIsRequestingOtp] = useState(false);
  
  // Add record state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [recordForm, setRecordForm] = useState({
    summary: '',
    details: '',
    documentUrl: '',
    imageUrls: [],
    otp: ''
  });
  const [formErrors, setFormErrors] = useState({});
  
  // Patient search
  const [patientSearchTerm, setPatientSearchTerm] = useState('');
  const [patientSearchResults, setPatientSearchResults] = useState([]);
  const [isPatientSearching, setIsPatientSearching] = useState(false);

  // Fetch patient data on initial load
  useEffect(() => {
    if (!patientId) {
      setPatientLoading(false);
      setLoading(false);
      return;
    }
    
    const fetchPatientData = async () => {
      setPatientLoading(true);
      try {
        const response = await api.get(`/api/doctor/patients/${patientId}/profile`);
        setPatientData(response.data);
      } catch (error) {
        console.error('Error fetching patient data:', error);
      } finally {
        setPatientLoading(false);
      }
    };
    
    fetchPatientData();
    setLoading(false);
  }, [patientId]);

  // Fetch medical records with OTP
  const fetchMedicalRecords = async () => {
    setLoading(true);
    try {
      const response = await api.post(`/api/doctor/patients/${patientId}/records`, { otp: otpValue });
      setRecords(response.data);
      setFilteredRecords(response.data);
      setOtpVerified(true);
    } catch (error) {
      console.error('Error fetching medical records:', error);
      setOtpError('Invalid OTP or access denied. Please try again.');
      setOtpVerified(false);
    } finally {
      setLoading(false);
    }
  };

  // Request OTP for viewing records
  const handleRequestOtp = async () => {
    setOtpError('');
    setOtpValue('');
    setIsRequestingOtp(true);
    try {
      const response = await api.post(`/api/doctor/patients/${patientId}/request-otp`);
      if (response.status === 200) {
        setIsOtpModalOpen(true);
      }
    } catch (error) {
      console.error('Error requesting OTP:', error);
      setOtpError('Failed to request OTP. Please try again.');
    } finally {
      setIsRequestingOtp(false);
    }
  };

  // Verify OTP to view records
  const handleVerifyOtp = async () => {
    if (!otpValue) {
      setOtpError('Please enter the OTP.');
      return;
    }
    try {
      await fetchMedicalRecords();
      setIsOtpModalOpen(false);
    } catch (error) {
      setOtpError('Invalid OTP. Please try again.');
    }
  };

  const handleOtpChange = (e) => {
    setOtpValue(e.target.value);
    if (otpError) setOtpError('');
  };

  // Add Record Functions
  const handleAddRecord = async () => {
    // Reset the form
    setRecordForm({
      summary: '',
      details: '',
      documentUrl: '',
      imageUrls: [],
      otp: ''
    });
    setFormErrors({});
    
    // Request OTP and show the form
    setIsRequestingOtp(true);
    try {
      await api.post(`/api/doctor/patients/${patientId}/request-otp`);
      setIsAddModalOpen(true);
    } catch (error) {
      console.error('Error requesting OTP:', error);
      alert('Failed to request OTP. Please try again.');
    } finally {
      setIsRequestingOtp(false);
    }
  };

  // Request a new OTP for add record form
  const requestNewOtp = async () => {
    setIsRequestingOtp(true);
    try {
      await api.post(`/api/doctor/patients/${patientId}/request-otp`);
      alert('New OTP sent to patient.');
      // Clear the current OTP field
      setRecordForm({...recordForm, otp: ''});
    } catch (error) {
      console.error('Error requesting new OTP:', error);
      alert('Failed to request new OTP. Please try again.');
    } finally {
      setIsRequestingOtp(false);
    }
  };

  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'documentUrl') {
      setRecordForm({...recordForm, documentUrl: files[0]});
    } else if (name === 'imageUrls') {
      setRecordForm({...recordForm, imageUrls: files});
    } else {
      setRecordForm({...recordForm, [name]: value});
    }
    // Clear any error for this field
    if (formErrors[name]) {
      setFormErrors({...formErrors, [name]: ''});
    }
  };

  // Validate add record form
  const validateRecordForm = () => {
    const errors = {};
    if (!recordForm.summary.trim()) errors.summary = 'Summary is required';
    if (!recordForm.details.trim()) errors.details = 'Details are required';
    if (!recordForm.otp.trim()) errors.otp = 'OTP is required';
    return errors;
  };

  // Submit add record form
  // 1. Update the handleAddRecordSubmit function to upload to Cloudinary

const handleAddRecordSubmit = async (e) => {
  e.preventDefault();
  
  // Validate form
  const errors = validateRecordForm();
  if (Object.keys(errors).length > 0) {
    setFormErrors(errors);
    return;
  }
  
  try {
    // Handle file uploads first if needed
    let documentUrl = '';
    let imageUrls = [];
    
    // If there's a document file, upload it to Cloudinary
    if (recordForm.documentUrl) {
      const documentFormData = new FormData();
      documentFormData.append('file', recordForm.documentUrl);
      documentFormData.append('upload_preset', 'emekatife'); // Set your Cloudinary upload preset here
      
      const cloudinaryResponse = await fetch('https://api.cloudinary.com/v1_1/delbvognh/auto/upload', {
        method: 'POST',
        body: documentFormData
      });
      
      const documentData = await cloudinaryResponse.json();
      documentUrl = documentData.secure_url;
    }
    
    // If there are image files, upload them to Cloudinary
    if (recordForm.imageUrls && recordForm.imageUrls.length > 0) {
      for (let i = 0; i < recordForm.imageUrls.length; i++) {
        const imageFormData = new FormData();
        imageFormData.append('file', recordForm.imageUrls[i]);
        imageFormData.append('upload_preset', 'emekatife'); // Set your Cloudinary upload preset here
        
        const cloudinaryResponse = await fetch('https://api.cloudinary.com/v1_1/delbvognh/image/upload', {
          method: 'POST',
          body: imageFormData
        });
        
        const imageData = await cloudinaryResponse.json();
        imageUrls.push(imageData.secure_url);
      }
    }
    
    // Prepare the data object with Cloudinary URLs
    const recordData = {
      otp: recordForm.otp,
      summary: recordForm.summary,
      details: recordForm.details,
      documentUrl: documentUrl,
      imageUrls: imageUrls
    };
    
    // Send the record data with the Cloudinary URLs
    const response = await api.post(
      `/api/doctor/patients/${patientId}/records/add`, 
      JSON.stringify(recordData),
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    // Update records and close modal
    setRecords([response.data.record, ...records]);
    setFilteredRecords([response.data.record, ...filteredRecords]);
    setIsAddModalOpen(false);
    alert('Record added successfully.');
  } catch (error) {
    console.error('Error adding record:', error);
    setFormErrors({general: 'Failed to add record. Please try again.'});
  }
};

  // Patient search functionality
  useEffect(() => {
    if (patientId || patientSearchTerm.length < 2) {
      setPatientSearchResults([]);
      return;
    }
    
    const searchPatients = async () => {
      setIsPatientSearching(true);
      try {
        const response = await api.get(`/api/doctor/patients/search?query=${patientSearchTerm}`);
        setPatientSearchResults(response.data);
      } catch (error) {
        setPatientSearchResults([]);
      } finally {
        setIsPatientSearching(false);
      }
    };
    
    const debounceTimeout = setTimeout(searchPatients, 300);
    return () => clearTimeout(debounceTimeout);
  }, [patientId, patientSearchTerm]);

  // Filter records based on search term
  useEffect(() => {
    if (!records.length) return;
    const filtered = records.filter(record => {
      return (
        record.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.documentUrl?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (record.imageUrls && record.imageUrls.some(url => url.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    });
    setFilteredRecords(filtered);
  }, [searchTerm, records]);

  // Format date utility function
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Handle patient selection
  const handlePatientSelect = (patient) => {
    navigate(`/doctor/patient-records?id=${patient._id}`);
  };

  // View record details
  const handleViewRecord = async (record) => {
    try {
      const response = await api.get(`/api/doctor/patients/${patientId}/records/${record._id}`, {
        headers: {'Authorization': `OTP ${otpValue}`}
      });
      setSelectedRecord(response.data);
    } catch (error) {
      setSelectedRecord(record);
    }
    setIsViewModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Patient Selection */}
      {!patientId ? (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Select a Patient</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search by patient name or email..."
              value={patientSearchTerm}
              onChange={(e) => setPatientSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
            />
            
            {patientSearchTerm.length >= 2 && (
              <div className="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-md max-h-60 overflow-auto">
                {isPatientSearching ? (
                  <div className="flex justify-center items-center p-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-500"></div>
                  </div>
                ) : patientSearchResults.length > 0 ? (
                  <ul className="py-1">
                    {patientSearchResults.map((patient) => (
                      <li 
                        key={patient._id} 
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handlePatientSelect(patient)}
                      >
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">{patient.firstName} {patient.lastName}</span>
                          <span className="text-sm text-gray-500">ID: {patient._id}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-4 text-center text-gray-500">No patients found</div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : patientLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
        </div>
      ) : patientData ? (
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {patientData.firstName} {patientData.lastName} (ID: {patientData._id})
            </h2>
            {!otpVerified && (
              <button
                onClick={handleRequestOtp}
                disabled={isRequestingOtp}
                className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700 disabled:bg-teal-300 flex items-center"
              >
                {isRequestingOtp ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Requesting...
                  </>
                ) : (
                  'Get Medical Records'
                )}
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Date of Birth</p>
              <p className="mt-1">{formatDate(patientData.DOB)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Gender</p>
              <p className="mt-1">{patientData.gender || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Blood Type</p>
              <p className="mt-1">{patientData.bloodType || 'Not recorded'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="mt-1">{patientData.email}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="text-center text-red-500">
            <p>Failed to load patient data.</p>
          </div>
        </div>
      )}

      {/* Medical Records Section */}
      {patientId && otpVerified && (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Medical Records</h2>
            <button
              onClick={handleAddRecord}
              disabled={isRequestingOtp}
              className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700 disabled:bg-teal-300 flex items-center"
            >
              {isRequestingOtp ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Requesting...
                </>
              ) : (
                'Add New Record'
              )}
            </button>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex flex-col md:flex-row gap-4 md:items-end">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search records..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6">
            {loading ? (
              <div className="flex justify-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
              </div>
            ) : filteredRecords.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Summary</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Images</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredRecords.map((record) => (
                      <tr key={record._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(record.createdAt || record.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.summary}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {record.details ? `${record.details.substring(0, 50)}...` : 'No details'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.documentUrl ? (
                            <a 
                              href={record.documentUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-teal-600 hover:text-teal-800"
                            >
                              View
                            </a>
                          ) : 'None'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.imageUrls && record.imageUrls.length > 0 ? (
                            <div className="flex space-x-1">
                              {record.imageUrls.slice(0, 2).map((url, index) => (
                                <a 
                                  key={index} 
                                  href={url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-teal-600 hover:text-teal-800"
                                >
                                  Image {index + 1}
                                </a>
                              ))}
                              {record.imageUrls.length > 2 && (
                                <span className="text-gray-500">+{record.imageUrls.length - 2} more</span>
                              )}
                            </div>
                          ) : 'None'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleViewRecord(record)}
                            className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <p>No medical records found.</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* OTP Modal */}
      {isOtpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Enter OTP</h2>
              <button 
                onClick={() => setIsOtpModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-gray-700">
                An OTP has been sent to the patient. Please enter it below.
              </p>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otpValue}
                onChange={handleOtpChange}
                className={`w-full px-3 py-2 border ${otpError ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm`}
              />
              {otpError && <p className="text-sm text-red-600">{otpError}</p>}
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setIsOtpModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleVerifyOtp}
                className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Record Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Add New Medical Record</h2>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleAddRecordSubmit} className="p-6 space-y-4">
              {/* General error message */}
              {formErrors.general && (
                <div className="bg-red-50 p-3 rounded-md text-sm text-red-700">
                  {formErrors.general}
                </div>
              )}

              {/* OTP Field */}
              <div>
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-gray-700">
                    OTP <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={requestNewOtp}
                    disabled={isRequestingOtp}
                    className="text-xs text-teal-600 hover:text-teal-800 flex items-center"
                  >
                    {isRequestingOtp ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-teal-600" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Requesting...
                      </>
                    ) : (
                      'Request New OTP'
                    )}
                  </button>
                </div>
                <input
                  type="text"
                  name="otp"
                  value={recordForm.otp}
                  onChange={handleFormChange}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    formErrors.otp ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm`}
                  placeholder="Enter verification OTP"
                />
                {formErrors.otp && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.otp}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  An OTP has been sent to the patient. Enter it here.
                </p>
              </div>
              
              {/* Summary */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Summary <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="summary"
                  value={recordForm.summary}
                  onChange={handleFormChange}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    formErrors.summary ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm`}
                  placeholder="Brief summary of the record"
                />
                {formErrors.summary && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.summary}</p>
                )}
              </div>
              
              {/* Details */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Details <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="details"
                  rows={4}
                  value={recordForm.details}
                  onChange={handleFormChange}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    formErrors.details ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm`}
                  placeholder="Detailed description"
                />
                {formErrors.details && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.details}</p>
                )}
              </div>
              
              {/* Document Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Upload Document (Optional)
                </label>
                <input
                  type="file"
                  name="documentUrl"
                  onChange={handleFormChange}
                  className="mt-1 block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-medium
                    file:bg-teal-50 file:text-teal-700
                    hover:file:bg-teal-100"
                />
              </div>
              
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Upload Images (Optional)
                </label>
                <input
                  type="file"
                  name="imageUrls"
                  multiple
                  onChange={handleFormChange}
                  className="mt-1 block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-medium
                    file:bg-teal-50 file:text-teal-700
                    hover:file:bg-teal-100"
                />
              </div>
            </form>
            
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddRecordSubmit}
                className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700"
              >
                Add Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Record Modal */}
      {isViewModalOpen && selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Medical Record Details</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Date</p>
                  <p className="mt-1">{formatDate(selectedRecord.createdAt || selectedRecord.date)}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Summary</p>
                <p className="mt-1">{selectedRecord.summary}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Details</p>
                <p className="mt-1">{selectedRecord.details}</p>
              </div>
              
              {selectedRecord.documentUrl && (
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-500">Document</p>
                  <a
                    href={selectedRecord.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    View Document
                  </a>
                </div>
              )}
              
              {selectedRecord.imageUrls && selectedRecord.imageUrls.length > 0 && (
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-500">Images</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedRecord.imageUrls.map((url, index) => (
                      <a
                        key={index}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Image {index + 1}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientRecords;