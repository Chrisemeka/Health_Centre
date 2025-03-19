import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalHospitals: 0,
    activeHospitals: 0,
    pendingHospitals: 0,
    totalPatients: 0,
    totalDoctors: 0,
  });

  // Hospitals list
  const [hospitals, setHospitals] = useState([]);

  // View hospital modal state
  const [isViewHospitalModalOpen, setIsViewHospitalModalOpen] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(null);

  useEffect(() => {
    // Simulate API call to fetch dashboard data
    const fetchDashboardData = async () => {
      setLoading(true);

      try {
        // In a real app, these would be API calls
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock stats data
        setStats({
          totalHospitals: 12,
          activeHospitals: 10,
          pendingHospitals: 2,
          totalPatients: 2580,
          totalDoctors: 145,
        });

        // Mock hospitals data
        setHospitals([
          {
            id: 1,
            name: 'Central Hospital',
            city: 'Boston',
            state: 'MA',
            adminName: 'Dr. James Wilson',
            doctors: 32,
            registeredDate: '2024-12-10',
          },
          {
            id: 2,
            name: 'City Medical Center',
            city: 'New York',
            state: 'NY',
            adminName: 'Dr. Sarah Chen',
            doctors: 45,
            registeredDate: '2024-11-05',
          },
          {
            id: 3,
            name: 'University Medical Center',
            city: 'Chicago',
            state: 'IL',
            adminName: 'Dr. Michael Brown',
            doctors: 28,
            registeredDate: '2024-10-22',
          },
          {
            id: 4,
            name: 'Community Health Clinic',
            city: 'San Francisco',
            state: 'CA',
            adminName: 'Dr. Lisa Garcia',
            doctors: 15,
            registeredDate: '2024-09-18',
          },
          {
            id: 5,
            name: 'Riverside Medical',
            city: 'Miami',
            state: 'FL',
            adminName: 'Dr. Robert Thompson',
            doctors: 22,
            registeredDate: '2025-03-02',
          },
          {
            id: 6,
            name: 'Metro Health Partners',
            city: 'Seattle',
            state: 'WA',
            adminName: 'Dr. Emily Wilson',
            doctors: 0,
            registeredDate: '2025-03-05',
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

  // Columns for hospitals table
  const hospitalColumns = [
    {
      header: 'Hospital Name',
      accessor: 'name',
    },
    {
      header: 'Location',
      accessor: 'city',
      cell: (row) => `${row.city}, ${row.state}`,
    },
    {
      header: 'Admin',
      accessor: 'adminName',
    },
    {
      header: 'Doctors',
      accessor: 'doctors',
    },
    {
      header: 'Registered',
      accessor: 'registeredDate',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Super Admin Dashboard</h1>
        <p className="text-sm text-gray-500">Welcome back, Super Admin</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { title: 'Total Hospitals', value: stats.totalHospitals, icon: 'hospital', color: 'blue' },
          { title: 'Active Hospitals', value: stats.activeHospitals, icon: 'check', color: 'green' },
          { title: 'Pending Hospitals', value: stats.pendingHospitals, icon: 'clock', color: 'yellow' },
          { title: 'Total Patients', value: stats.totalPatients, icon: 'users', color: 'blue' },
          { title: 'Total Doctors', value: stats.totalDoctors, icon: 'doctor', color: 'purple' },
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
                      stat.icon === 'hospital'
                        ? 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
                        : stat.icon === 'check'
                        ? 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                        : stat.icon === 'clock'
                        ? 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                        : stat.icon === 'users'
                        ? 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                        : 'M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z'
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

      {/* Hospitals Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Registered Hospitals</h2>
          <Link
            to="/superadmin/hospitals"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Register New Hospital
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          </div>
        ) : hospitals.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {hospitalColumns.map((column, index) => (
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
                {hospitals.map((hospital) => (
                  <tr key={hospital.id}>
                    {hospitalColumns.map((column, index) => (
                      <td key={index} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {column.cell ? column.cell(hospital) : hospital[column.accessor]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <p>No hospitals registered yet.</p>
            <Link
              to="/superadmin/hospitals"
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Register First Hospital
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdminDashboard;