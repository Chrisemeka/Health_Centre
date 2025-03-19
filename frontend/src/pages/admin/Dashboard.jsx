import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPatients: 0,
    totalDoctors: 0,
    totalRecords: 0,
    activeSessions: 0,
  });

  // Recent activity logs
  const [activityLogs, setActivityLogs] = useState([]);

  // Recent user registrations
  const [recentUsers, setRecentUsers] = useState([]);

  useEffect(() => {
    // Simulate API call to fetch dashboard data
    const fetchDashboardData = async () => {
      setLoading(true);

      try {
        // In a real app, these would be API calls
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock stats data
        setStats({
          totalUsers: 275,
          totalPatients: 230,
          totalDoctors: 35,
          totalRecords: 1842,
          activeSessions: 42,
        });

        // Mock activity logs
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

        // Mock recent users
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
        <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
        <p className="text-sm text-gray-500">Welcome back, Admin</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { title: 'Total Users', value: stats.totalUsers, icon: 'users', color: 'purple' },
          { title: 'Patients', value: stats.totalPatients, icon: 'patients', color: 'blue' },
          { title: 'Doctors', value: stats.totalDoctors, icon: 'doctors', color: 'purple' },
          { title: 'Total Records', value: stats.totalRecords, icon: 'records', color: 'green' },
          { title: 'Active Sessions', value: stats.activeSessions, icon: 'sessions', color: 'yellow' },
        ].map((stat, index) => (
          <div
            key={index}
            className={`bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 text-white p-6 rounded-lg shadow-md`}
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-full bg-${stat.color}-200 bg-opacity-30`}>
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
                    d={
                      stat.icon === 'users'
                        ? 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
                        : stat.icon === 'patients'
                        ? 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                        : stat.icon === 'doctors'
                        ? 'M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                        : stat.icon === 'records'
                        ? 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                        : 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                    }
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-white">{stat.title}</p>
                <p className="text-2xl font-semibold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
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
              to="/admin/create-user"
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