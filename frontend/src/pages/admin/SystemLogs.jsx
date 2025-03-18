import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const SystemLogs = () => {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    // Simulate API call to fetch all logs
    const fetchAllLogs = async () => {
      setLoading(true);

      try {
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock expanded logs data (more than what's on the dashboard)
        setLogs([
          {
            id: 1,
            details: 'New doctor account created: Dr. Emma Johnson',
            timestamp: '2025-03-08 10:25:32',
            user: 'admin@example.com',
            ipAddress: '192.168.1.105',
          },
          {
            id: 2,
            details: 'Patient record accessed by an unauthorized user',
            timestamp: '2025-03-08 09:15:44',
            user: 'doctor@example.com',
            ipAddress: '192.168.1.110',
          },
          {
            id: 3,
            details: 'User profile updated: John Smith (Patient)',
            timestamp: '2025-03-07 16:45:22',
            user: 'admin@example.com',
            ipAddress: '192.168.1.105',
          },
          {
            id: 4,
            details: 'System backup completed successfully',
            timestamp: '2025-03-07 01:00:00',
            user: 'system',
            ipAddress: 'localhost',
          },
          {
            id: 5,
            details: 'New patient account created: Sarah Johnson',
            timestamp: '2025-03-06 14:12:05',
            user: 'admin@example.com',
            ipAddress: '192.168.1.105',
          },
          {
            id: 6,
            details: 'Multiple failed login attempts for user account',
            timestamp: '2025-03-06 10:42:18',
            user: 'unknown',
            ipAddress: '203.0.113.45',
          },
          {
            id: 7,
            details: 'Patient medical record updated: Emily Davis',
            timestamp: '2025-03-05 15:37:29',
            user: 'dr.wilson@example.com',
            ipAddress: '192.168.1.120',
          },
          {
            id: 8,
            details: 'User permission level modified: Dr. James Wilson',
            timestamp: '2025-03-05 11:22:43',
            user: 'admin@example.com',
            ipAddress: '192.168.1.105',
          },
          {
            id: 9,
            details: 'Database connection timeout during backup process',
            timestamp: '2025-03-04 02:15:10',
            user: 'system',
            ipAddress: 'localhost',
          },
          {
            id: 10,
            details: 'User account removed: Robert Thompson',
            timestamp: '2025-03-03 09:05:58',
            user: 'admin@example.com',
            ipAddress: '192.168.1.105',
          },
          {
            id: 11,
            details: 'Multiple patient records accessed by Dr. Emma Johnson',
            timestamp: '2025-03-02 14:33:27',
            user: 'emma.johnson@example.com',
            ipAddress: '192.168.1.115',
          },
          {
            id: 12,
            details: 'System software updated to version 2.4.1',
            timestamp: '2025-03-01 03:00:00',
            user: 'system',
            ipAddress: 'localhost',
          },
        ]);
      } catch (error) {
        console.error('Error fetching logs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllLogs();
  }, []);

  // Filter logs based on search term and date range
  const filteredLogs = logs.filter(log => {
    const matchesFilter = filter === '' || 
      log.details.toLowerCase().includes(filter.toLowerCase()) ||
      log.user.toLowerCase().includes(filter.toLowerCase());
    
    const logDate = new Date(log.timestamp);
    const afterStartDate = dateRange.start ? logDate >= new Date(dateRange.start) : true;
    const beforeEndDate = dateRange.end ? logDate <= new Date(`${dateRange.end}T23:59:59`) : true;
    
    return matchesFilter && afterStartDate && beforeEndDate;
  });

  // Columns for logs table
  const logColumns = [
    {
      header: 'Details',
      accessor: 'details',
    },
    {
      header: 'User',
      accessor: 'user',
    },
    {
      header: 'IP Address',
      accessor: 'ipAddress',
    },
    {
      header: 'Timestamp',
      accessor: 'timestamp',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">System Logs</h1>
        <Link
          to="/admin/dashboard"
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Back to Dashboard
        </Link>
      </div>

      {/* Filter and search */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search Logs
            </label>
            <input
              type="text"
              id="search"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="Search by details, or user..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Logs table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">All System Activity Logs</h2>
        
        {loading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          </div>
        ) : filteredLogs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {logColumns.map((column, index) => (
                    <th
                      key={index}
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {column.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLogs.map((log) => (
                  <tr key={log.id}>
                    {logColumns.map((column, index) => (
                      <td key={index} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {column.cell ? column.cell(log) : log[column.accessor]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <p>No logs found matching your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemLogs;