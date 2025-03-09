import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PatientRecords = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract patient ID from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const patientId = queryParams.get('id');
  
  const [loading, setLoading] = useState(true);
  const [patientLoading, setPatientLoading] = useState(true);
  const [patientData, setPatientData] = useState(null);
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  
  // Form for adding/updating records
  const [recordForm, setRecordForm] = useState({
    type: '',
    summary: '',
    details: '',
    fileUpload: null,
  });
  const [formErrors, setFormErrors] = useState({});
  
  // Patient search when no ID is provided
  const [patientSearchTerm, setPatientSearchTerm] = useState('');
  const [patientSearchResults, setPatientSearchResults] = useState([]);
  const [isPatientSearching, setIsPatientSearching] = useState(false);

  useEffect(() => {
    // If no patient ID is provided, don't try to fetch data
    if (!patientId) {
      setPatientLoading(false);
      setLoading(false);
      return;
    }
    
    // Simulate API call to fetch patient data
    const fetchPatientData = async () => {
      setPatientLoading(true);
      
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock patient data
        const mockPatient = {
          id: patientId,
          name: 'John Doe',
          dateOfBirth: '1985-05-15',
          gender: 'Male',
          phone: '123-456-7890',
          email: 'john.doe@example.com',
          address: '123 Main Street, Anytown, ST 12345',
          bloodType: 'A+',
          allergies: 'Penicillin, Peanuts',
          nextOfKin: 'Jane Doe (Spouse)',
          nextOfKinPhone: '987-654-3210',
        };
        
        setPatientData(mockPatient);
      } catch (error) {
        console.error('Error fetching patient data:', error);
      } finally {
        setPatientLoading(false);
      }
    };
    
    // Simulate API call to fetch medical records
    const fetchMedicalRecords = async () => {
      setLoading(true);
      
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockRecords = [
          {
            id: 1,
            type: 'Laboratory Results',
            date: '2025-02-28',
            summary: 'Blood work results - all normal',
            details: 'Complete blood count (CBC), Comprehensive Metabolic Panel (CMP), Lipid Panel, and Thyroid Function Tests were performed. All results within normal ranges.',
            fileUrl: '#',
            fileType: 'PDF',
            doctor: 'Dr. Sarah Johnson',
            hospital: 'Central Hospital'
          },
          {
            id: 2,
            type: 'Prescription',
            date: '2025-02-15',
            summary: 'Prescription for hypertension medication',
            details: 'Prescribed Lisinopril 10mg, once daily. Follow up in 3 months to monitor blood pressure.',
            fileUrl: '#',
            fileType: 'PDF',
            doctor: 'Dr. Michael Chen',
            hospital: 'City Medical Center'
          },
          {
            id: 3,
            type: 'Diagnosis',
            date: '2025-01-20',
            summary: 'Seasonal allergies diagnosis and treatment plan',
            details: 'Patient presented with nasal congestion, sneezing, and itchy eyes. Diagnosed with seasonal allergic rhinitis. Prescribed Loratadine 10mg once daily as needed.',
            fileUrl: '#',
            fileType: 'PDF',
            doctor: 'Dr. Sarah Johnson',
            hospital: 'Central Hospital'
          },
          {
            id: 4,
            type: 'Imaging',
            date: '2024-12-10',
            summary: 'Chest X-ray results',
            details: 'Chest X-ray performed to rule out pneumonia. Results show clear lung fields with no evidence of consolidation, effusion, or pneumothorax.',
            fileUrl: '#',
            fileType: 'JPEG',
            doctor: 'Dr. James Wilson',
            hospital: 'University Medical Center'
          },
          {
            id: 5,
            type: 'Vaccination',
            date: '2024-11-05',
            summary: 'Annual flu vaccination',
            details: 'Patient received quadrivalent influenza vaccine. No adverse reactions noted.',
            fileUrl: '#',
            fileType: 'PDF',
            doctor: 'Dr. Lisa Garcia',
            hospital: 'Community Health Clinic'
          },
          {
            id: 6,
            type: 'Surgery',
            date: '2024-09-15',
            summary: 'Appendectomy surgical report',
            details: 'Patient underwent laparoscopic appendectomy for acute appendicitis. Procedure was uncomplicated. Patient recovered well postoperatively.',
            fileUrl: '#',
            fileType: 'PDF',
            doctor: 'Dr. Robert Thompson',
            hospital: 'Central Hospital'
          }
        ];
        
        setRecords(mockRecords);
        setFilteredRecords(mockRecords);
      } catch (error) {
        console.error('Error fetching medical records:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPatientData();
    fetchMedicalRecords();
  }, [patientId]);

  // Search for patients when no ID is provided
  useEffect(() => {
    if (patientId || patientSearchTerm.length < 2) {
      setPatientSearchResults([]);
      return;
    }
    
    const searchPatients = async () => {
      setIsPatientSearching(true);
      
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock search results
        const mockResults = [
          { id: 'P-12345', name: 'John Doe', dateOfBirth: '1985-05-15' },
          { id: 'P-12346', name: 'Sarah Johnson', dateOfBirth: '1990-08-21' },
          { id: 'P-12347', name: 'Robert Smith', dateOfBirth: '1978-11-03' },
          { id: 'P-12348', name: 'Emily Wilson', dateOfBirth: '1992-04-17' },
          { id: 'P-12349', name: 'Michael Brown', dateOfBirth: '1982-09-28' },
        ].filter(patient => 
          patient.name.toLowerCase().includes(patientSearchTerm.toLowerCase()) ||
          patient.id.toLowerCase().includes(patientSearchTerm.toLowerCase())
        );
        
        setPatientSearchResults(mockResults);
      } catch (error) {
        console.error('Error searching patients:', error);
      } finally {
        setIsPatientSearching(false);
      }
    };
    
    const debounceTimeout = setTimeout(() => {
      searchPatients();
    }, 300);
    
    return () => clearTimeout(debounceTimeout);
  }, [patientId, patientSearchTerm]);

  // Filter records based on search term and type filter
  useEffect(() => {
    if (!records.length) return;
    
    const filtered = records.filter(record => {
      const matchesSearch = 
        record.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.hospital.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = filterType === 'all' || record.type === filterType;
      
      return matchesSearch && matchesType;
    });
    
    setFilteredRecords(filtered);
  }, [searchTerm, filterType, records]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
  };

  const handlePatientSelect = (patient) => {
    navigate(`/doctor/patient-records?id=${patient.id}`);
  };

  const handleViewRecord = (record) => {
    setSelectedRecord(record);
    setIsViewModalOpen(true);
  };

  const handleAddRecord = () => {
    // Reset form
    setRecordForm({
      type: '',
      summary: '',
      details: '',
      fileUpload: null
    });
    setFormErrors({});
    setIsAddModalOpen(true);
  };



  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'fileUpload' && files && files[0]) {
      setRecordForm({
        ...recordForm,
        fileUpload: files[0]
      });
    } else {
      setRecordForm({
        ...recordForm,
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

  const validateRecordForm = () => {
    const errors = {};
    
    if (!recordForm.type) {
      errors.type = 'Record type is required';
    }
    
    if (!recordForm.summary.trim()) {
      errors.summary = 'Summary is required';
    }
    
    if (!recordForm.details.trim()) {
      errors.details = 'Details are required';
    }
    
    return errors;
  };

  const handleAddRecordSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateRecordForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    try {
      // In a real app, this would be an API call to save the record
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a new record with current data
      const newRecord = {
        id: records.length + 1,
        type: recordForm.type,
        date: new Date().toISOString().split('T')[0],
        summary: recordForm.summary,
        details: recordForm.details,
        fileUrl: '#', // This would be a real URL in production
        fileType: recordForm.fileUpload ? recordForm.fileUpload.type.split('/')[1].toUpperCase() : 'PDF',
        doctor: 'Dr. Smith', // This would be the current user's name
        hospital: 'Central Hospital' // This would be the doctor's hospital
      };
      
      // Add to the records list
      setRecords([newRecord, ...records]);
      
      // Close modal and show success message
      setIsAddModalOpen(false);
      alert('Medical record added successfully.');
    } catch (error) {
      console.error('Error adding medical record:', error);
      setFormErrors({
        general: 'Failed to add record. Please try again.'
      });
    }
  };


  // Get unique record types for filter dropdown
  const recordTypes = records.length ? ['all', ...new Set(records.map(record => record.type))] : ['all'];

  return (
    <div className="space-y-6">
      {/* Patient Selection or Patient Info */}
      {!patientId ? (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Select a Patient</h2>
          <div className="relative">
            <label htmlFor="patientSearch" className="block text-sm font-medium text-gray-700">
              Search Patient
            </label>
            <input
              id="patientSearch"
              type="text"
              placeholder="Search by patient name or ID..."
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
                        key={patient.id} 
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handlePatientSelect(patient)}
                      >
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">{patient.name}</span>
                          <span className="text-sm text-gray-500">
                            ID: {patient.id} | DOB: {patient.dateOfBirth}
                          </span>
                        </div>
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
            
            <div className="mt-4 text-center text-gray-500">
              Please search for a patient to view their medical records.
            </div>
          </div>
        </div>
      ) : patientLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
        </div>
      ) : patientData ? (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{`Patient: ${patientData.name} (${patientData.id})`}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Date of Birth</p>
              <p className="mt-1">{patientData.dateOfBirth}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Gender</p>
              <p className="mt-1">{patientData.gender}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Blood Type</p>
              <p className="mt-1">{patientData.bloodType}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Phone</p>
              <p className="mt-1">{patientData.phone}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="mt-1">{patientData.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Address</p>
              <p className="mt-1">{patientData.address}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Allergies</p>
              <p className="mt-1">{patientData.allergies}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Next of Kin</p>
              <p className="mt-1">{patientData.nextOfKin}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Next of Kin Phone</p>
              <p className="mt-1">{patientData.nextOfKinPhone}</p>
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
      {patientId && (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Medical Records</h2>
            <button
              onClick={handleAddRecord}
              className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700"
            >
              Add New Record
            </button>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex flex-col md:flex-row gap-4 md:items-end">
              <div className="flex-1">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                  Search Records
                </label>
                <input
                  id="search"
                  type="text"
                  placeholder="Search by type, summary, details, doctor, or hospital..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                />
              </div>
              <div className="md:w-1/4">
                <label htmlFor="recordType" className="block text-sm font-medium text-gray-700 mb-1">
                  Filter by Type
                </label>
                <select
                  id="recordType"
                  name="recordType"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md"
                  value={filterType}
                  onChange={handleFilterChange}
                >
                  {recordTypes.map((type) => (
                    <option key={type} value={type}>
                      {type === 'all' ? 'All Types' : type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Medical Records</h2>
            {loading ? (
              <div className="flex justify-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
              </div>
            ) : filteredRecords.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Summary
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Doctor
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hospital
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredRecords.map((record) => (
                      <tr key={record.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            record.type === 'Laboratory Results' ? 'bg-blue-100 text-blue-800' :
                            record.type === 'Prescription' ? 'bg-green-100 text-green-800' :
                            record.type === 'Diagnosis' ? 'bg-purple-100 text-purple-800' :
                            record.type === 'Imaging' ? 'bg-amber-100 text-amber-800' :
                            record.type === 'Vaccination' ? 'bg-teal-100 text-teal-800' :
                            record.type === 'Surgery' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {record.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.summary}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.doctor}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.hospital}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleViewRecord(record)}
                              className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700"
                            >
                              View
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
                <p>No medical records found matching your search criteria.</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* View Record Modal */}
      {isViewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Medical Record Details</h2>
            </div>
            <div className="p-6 space-y-4">
              {selectedRecord && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Type</p>
                      <p className="mt-1">{selectedRecord.type}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Date</p>
                      <p className="mt-1">{selectedRecord.date}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Doctor</p>
                      <p className="mt-1">{selectedRecord.doctor}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Hospital</p>
                      <p className="mt-1">{selectedRecord.hospital}</p>
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
                  
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-500">Document</p>
                    <div className="mt-2">
                      <a
                        href={selectedRecord.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        View {selectedRecord.fileType} Document
                      </a>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
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

      {/* Add Record Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Add New Medical Record</h2>
            </div>
            <form onSubmit={handleAddRecordSubmit} className="p-6 space-y-4">
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
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Record Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="type"
                  name="type"
                  className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md ${
                    formErrors.type ? 'border-red-300 text-red-900' : ''
                  }`}
                  value={recordForm.type}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">Select a type</option>
                  <option value="Laboratory Results">Laboratory Results</option>
                  <option value="Prescription">Prescription</option>
                  <option value="Diagnosis">Diagnosis</option>
                  <option value="Imaging">Imaging</option>
                  <option value="Vaccination">Vaccination</option>
                  <option value="Surgery">Surgery</option>
                  <option value="Consultation">Consultation</option>
                  <option value="Physical Examination">Physical Examination</option>
                </select>
                {formErrors.type && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.type}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="summary" className="block text-sm font-medium text-gray-700">
                  Summary <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="summary"
                  name="summary"
                  className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm ${
                    formErrors.summary ? 'border-red-300 text-red-900' : ''
                  }`}
                  placeholder="Brief summary of the record"
                  value={recordForm.summary}
                  onChange={handleFormChange}
                  required
                />
                {formErrors.summary && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.summary}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="details" className="block text-sm font-medium text-gray-700">
                  Details <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="details"
                  name="details"
                  rows={5}
                  className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm ${
                    formErrors.details ? 'border-red-300 text-red-900' : ''
                  }`}
                  placeholder="Detailed description of the record"
                  value={recordForm.details}
                  onChange={handleFormChange}
                  required
                />
                {formErrors.details && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.details}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="fileUpload" className="block text-sm font-medium text-gray-700">
                  Upload Document (Optional)
                </label>
                <input
                  type="file"
                  id="fileUpload"
                  name="fileUpload"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  onChange={handleFormChange}
                />
              </div>
            </form>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleAddRecordSubmit}
                className="ml-3 px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700"
              >
                Add Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Record Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
            <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Add New Medical Record</h2>
            </div>
            <form onSubmit={handleAddRecordSubmit} className="p-6 space-y-6">
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

                {/* Updated Input Fields */}
                <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                    Record Type <span className="text-red-500">*</span>
                </label>
                <select
                    id="type"
                    name="type"
                    className={`mt-2 block w-full pl-4 pr-10 py-3 text-base border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm ${
                    formErrors.type ? 'border-red-300 text-red-900' : ''
                    }`}
                    value={recordForm.type}
                    onChange={handleFormChange}
                    required
                >
                    <option value="">Select a type</option>
                    <option value="Laboratory Results">Laboratory Results</option>
                    <option value="Prescription">Prescription</option>
                    <option value="Diagnosis">Diagnosis</option>
                    <option value="Imaging">Imaging</option>
                    <option value="Vaccination">Vaccination</option>
                    <option value="Surgery">Surgery</option>
                    <option value="Consultation">Consultation</option>
                    <option value="Physical Examination">Physical Examination</option>
                </select>
                {formErrors.type && (
                    <p className="mt-2 text-sm text-red-600">{formErrors.type}</p>
                )}
                </div>

                <div>
                <label htmlFor="summary" className="block text-sm font-medium text-gray-700">
                    Summary <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="summary"
                    name="summary"
                    className={`mt-2 block w-full px-4 py-3 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm ${
                    formErrors.summary ? 'border-red-300 text-red-900' : ''
                    }`}
                    placeholder="Brief summary of the record"
                    value={recordForm.summary}
                    onChange={handleFormChange}
                    required
                />
                {formErrors.summary && (
                    <p className="mt-2 text-sm text-red-600">{formErrors.summary}</p>
                )}
                </div>

                <div>
                <label htmlFor="details" className="block text-sm font-medium text-gray-700">
                    Details <span className="text-red-500">*</span>
                </label>
                <textarea
                    id="details"
                    name="details"
                    rows={5}
                    className={`mt-2 block w-full px-4 py-3 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm ${
                    formErrors.details ? 'border-red-300 text-red-900' : ''
                    }`}
                    placeholder="Detailed description of the record"
                    value={recordForm.details}
                    onChange={handleFormChange}
                    required
                />
                {formErrors.details && (
                    <p className="mt-2 text-sm text-red-600">{formErrors.details}</p>
                )}
                </div>

                <div>
                <label htmlFor="fileUpload" className="block text-sm font-medium text-gray-700">
                    Upload Document (Optional)
                </label>
                <input
                    type="file"
                    id="fileUpload"
                    name="fileUpload"
                    className="mt-2 block w-full px-4 py-3 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                    onChange={handleFormChange}
                />
                </div>
            </form>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
                <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                Cancel
                </button>
                <button
                type="submit"
                onClick={handleAddRecordSubmit}
                className="ml-3 px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700"
                >
                Add Record
                </button>
            </div>
            </div>
        </div>
    )}
    </div>
  );
};

export default PatientRecords;