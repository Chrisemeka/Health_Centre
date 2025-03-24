import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAdmins: 0,
    totalPatients: 0,
    totalDoctors: 0,
    logs: []
  });

  // Recent activity logs
  const [activityLogs, setActivityLogs] = useState([]);

  // Recent user registrations
  const [recentUsers, setRecentUsers] = useState([]);

  useEffect(() => {
    // Fetch dashboard data
    const fetchDashboardData = async () => {
      setLoading(true);

      try {
        // Fetch stats from API
        const statsResponse = await api.get('/api/super/stats');
        console.log('Stats response:', statsResponse.data);
        
        // Set stats from API
        setStats(statsResponse.data);

        // Mock activity logs - in real implementation, these could come from the API
        setActivityLogs([
          {
            id: 1,
            action: 'User Created',
            details: 'New doctor account created: Dr. Emma Johnson',
            timestamp: '2025-03-08 10:25:32',
            user: 'admin@example.com',
          },
          {
            id: 2,
            action: 'Record Access',
            details: 'Patient record accessed by an unauthorized user',
            timestamp: '2025-03-08 09:15:44',
            user: 'doctor@example.com',
          },
          {
            id: 3,
            action: 'User Updated',
            details: 'User profile updated: John Smith (Patient)',
            timestamp: '2025-03-07 16:45:22',
            user: 'admin@example.com',
          },
          {
            id: 4,
            action: 'System Update',
            details: 'System backup completed successfully',
            timestamp: '2025-03-07 01:00:00',
            user: 'system',
          },
          {
            id: 5,
            action: 'User Created',
            details: 'New patient account created: Sarah Johnson',
            timestamp: '2025-03-06 14:12:05',
            user: 'admin@example.com',
          },
        ]);

        // Set recent users - could be fetched from API in the future
        setRecentUsers([
          {
            id: 1,
            name: 'Dr. Emma Johnson',
            email: 'emma.johnson@example.com',
            role: 'Doctor',
            registerDate: '2025-03-08',
            status: 'Active',
          },
          {
            id: 2,
            name: 'Sarah Johnson',
            email: 'sarah.j@example.com',
            role: 'Patient',
            registerDate: '2025-03-06',
            status: 'Active',
          },
          {
            id: 3,
            name: 'Michael Brown',
            email: 'michael.b@example.com',
            role: 'Patient',
            registerDate: '2025-03-05',
            status: 'Active',
          },
          {
            id: 4,
            name: 'Dr. James Wilson',
            email: 'james.wilson@example.com',
            role: 'Doctor',
            registerDate: '2025-03-04',
            status: 'Pending',
          },
          {
            id: 5,
            name: 'Emily Davis',
            email: 'emily.d@example.com',
            role: 'Patient',
            registerDate: '2025-03-03',
            status: 'Active',
          },
        ]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Calculate total users
  const totalUsers = stats.totalAdmins + stats.totalPatients + stats.totalDoctors;

  // Columns for activity logs table
  const activityLogColumns = [
    {
      header: 'Action',
      accessor: 'action',
      cell: (row) => {
        const actionColors = {
          'User Created': 'bg-green-100 text-green-800',
          'User Updated': 'bg-blue-100 text-blue-800',
          'Record Access': 'bg-red-100 text-red-800',
          'System Update': 'bg-purple-100 text-purple-800',
        };

        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              actionColors[row.action] || 'bg-gray-100 text-gray-800'
            }`}
          >
            {row.action}
          </span>
        );
      },
    },
    {
      header: 'Details',
      accessor: 'details',
    },
    {
      header: 'User',
      accessor: 'user',
    },
    {
      header: 'Timestamp',
      accessor: 'timestamp',
    },
  ];

  // Columns for recent users table
  const recentUserColumns = [
    {
      header: 'Name',
      accessor: 'name',
    },
    {
      header: 'Email',
      accessor: 'email',
    },
    {
      header: 'Role',
      accessor: 'role',
      cell: (row) => {
        const roleColors = {
          Doctor: 'bg-indigo-100 text-indigo-800',
          Patient: 'bg-blue-100 text-blue-800',
          Admin: 'bg-purple-100 text-purple-800',
        };

        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleColors[row.role]}`}>
            {row.role}
          </span>
        );
      },
    },
    {
      header: 'Registration Date',
      accessor: 'registerDate',
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row) => {
        const statusColors = {
          Active: 'bg-green-100 text-green-800',
          Pending: 'bg-yellow-100 text-yellow-800',
          Inactive: 'bg-red-100 text-red-800',
        };

        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[row.status]}`}>
            {row.status}
          </span>
        );
      },
    },
    {
      header: 'Actions',
      cell: (row) => (
        <Link to={`/admin/user/${row.id}`}>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500">
            View
          </button>
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Super Admin Dashboard</h1>
        <p className="text-sm text-gray-500">Welcome back, Super Admin</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-200 bg-opacity-30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-white">Total Users</p>
              <p className="text-2xl font-semibold">{totalUsers}</p>
            </div>
          </div>
        </div>

        {/* Admins */}
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-200 bg-opacity-30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-white">Admins</p>
              <p className="text-2xl font-semibold">{stats.totalAdmins}</p>
            </div>
          </div>
        </div>

        {/* Patients */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-200 bg-opacity-30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-white">Patients</p>
              <p className="text-2xl font-semibold">{stats.totalPatients}</p>
            </div>
          </div>
        </div>

        {/* Doctors */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-200 bg-opacity-30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-white">Doctors</p>
              <p className="text-2xl font-semibold">{stats.totalDoctors}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity Logs */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
            <Link
              to="/admin/system-logs"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              View All Logs
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            </div>
          ) : activityLogs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {activityLogColumns.map((column, index) => (
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
                  {activityLogs.map((log) => (
                    <tr key={log.id}>
                      {activityLogColumns.map((column, index) => (
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
              <p>No activity logs found.</p>
            </div>
          )}
        </div>

        {/* Recent User Registrations */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent User Registrations</h2>
            <Link
              to="/superadmin/create-user"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Create User
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            </div>
          ) : recentUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {recentUserColumns.map((column, index) => (
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
                  {recentUsers.map((user) => (
                    <tr key={user.id}>
                      {recentUserColumns.map((column, index) => (
                        <td key={index} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {column.cell ? column.cell(user) : user[column.accessor]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <p>No recent user registrations.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;