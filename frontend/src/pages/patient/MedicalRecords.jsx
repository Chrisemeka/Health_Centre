import React, { useState, useEffect } from 'react';
import api from '../../api';

const MedicalRecords = () => {
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMedicalRecords = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await api.get('/api/patient/medical-records');
        // Ensure we have an array and each record has required fields
        const formattedRecords = Array.isArray(response.data) 
          ? response.data.map(record => ({
              id: record.id || Math.random().toString(36).substr(2, 9),
              type: record.type || 'Unknown',
              hospital: record.hospital || '',
              doctor: record.doctor || '',
              date: record.date || new Date().toISOString(),
              summary: record.summary || '',
              details: record.details || '',
              documentUrl: record.documentUrl || null
            }))
          : [];
        
        setRecords(formattedRecords);
        setFilteredRecords(formattedRecords);
      } catch (error) {
        console.error('Error fetching medical records:', error);
        setError('Failed to load medical records. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMedicalRecords();
  }, []);

  useEffect(() => {
    // Filter records based on search term
    const filtered = records.filter(record => {
      return (
        (record.hospital && record.hospital.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (record.doctor && record.doctor.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (record.summary && record.summary.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    });
    
    setFilteredRecords(filtered);
  }, [searchTerm, records]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleViewRecord = (record) => {
    setSelectedRecord(record);
    setIsViewModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">Medical Records</h1>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Search Section */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 md:items-end">
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                Search Records
              </label>
              <input
                id="search"
                type="text"
                placeholder="Search by hospital, doctor, or summary..."
                value={searchTerm}
                onChange={handleSearch}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Records Table */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Medical Records</h2>
          {loading ? (
            <div className="flex justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
            </div>
          ) : filteredRecords.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  {/* <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hospital
                  </th> */}
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  {/* <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doctor
                  </th> */}
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Summary
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRecords.map((record) => (
                  <tr key={record.id}>
                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.hospital || 'N/A'}
                    </td> */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.doctor || 'N/A'}
                    </td> */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.summary || 'No summary available'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <button
                        onClick={() => handleViewRecord(record)}
                        className="px-3 py-1 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <p>No medical records found matching your search criteria.</p>
            </div>
          )}
        </div>

        {/* View Record Modal */}
        {isViewModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Medical Record Details</h2>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {selectedRecord && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Date</p>
                      <p className="mt-1">{new Date(selectedRecord.date).toLocaleDateString()}</p>
                    </div>
                    {/* <div>
                      <p className="text-sm font-medium text-gray-500">Hospital</p>
                      <p className="mt-1">{selectedRecord.hospital || 'N/A'}</p>
                    </div> */}
                    {/* <div>
                      <p className="text-sm font-medium text-gray-500">Doctor</p>
                      <p className="mt-1">{selectedRecord.doctor || 'N/A'}</p>
                    </div> */}
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Summary</p>
                    <p className="mt-1">{selectedRecord.summary || 'No summary available'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Details</p>
                    <p className="mt-1">{selectedRecord.details || 'No details available'}</p>
                  </div>
                  
                  {selectedRecord.documentUrl && (
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-sm font-medium text-gray-500">Document</p>
                      <div className="mt-2">
                        <a
                          href={selectedRecord.documentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          View Document
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalRecords;