import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalHospitals: 0,
    activeHospitals: 0,
    totalPatients: 0,
    totalDoctors: 0,
  });

  // Hospitals list
  const [hospitals, setHospitals] = useState([]);


  useEffect(() => {
    fetchHospitalsData();
  }, []);

  const fetchHospitalsData = async () => {
    setLoading(true);
    setStatsLoading(true);

    try {
      // Fetch hospitals data
      const hospitalsResponse = await api.get('/api/admin/hospitals');
      console.log('Hospitals data:', hospitalsResponse.data);
      
      const hospitalsData = hospitalsResponse.data;
      setHospitals(hospitalsData);

      // Count active hospitals
      const activeHospitals = hospitalsData.filter(hospital => hospital.status === 'Active').length;
      
      // Initial stats with counts we already know
      const initialStats = {
        totalHospitals: hospitalsData.length,
        activeHospitals,
        totalPatients: 0,
        totalDoctors: 0
      };
      
      setStats(initialStats);
      
      // Now fetch stats for each hospital and accumulate the results
      const fetchAllStats = async () => {
        let totalDoctors = 0;
        let totalPatients = 0;
        
        // Create an array of promises for all the stats requests
        const statsPromises = hospitalsData.map(hospital => 
          api.get(`/api/admin/hospitals/${hospital._id}/stats`)
            .then(response => {
              console.log(`Stats for hospital ${hospital.name}:`, response.data);
              return response.data;
            })
            .catch(error => {
              console.error(`Error fetching stats for hospital ${hospital._id}:`, error);
              return { numDoctors: 0, numPatients: 0 }; // Default values if request fails
            })
        );
        
        // Wait for all stats requests to complete
        const allStats = await Promise.all(statsPromises);
        
        // Accumulate the stats
        allStats.forEach(hospitalStats => {
          totalDoctors += hospitalStats.numDoctors || 0;
          totalPatients += hospitalStats.numPatients || 0;
        });
        
        // Update the stats state with the accumulated values
        setStats(prevStats => ({
          ...prevStats,
          totalDoctors,
          totalPatients
        }));
        
        setStatsLoading(false);
      };
      
      // Start fetching all hospital stats
      fetchAllStats();
      
    } catch (error) {
      console.error('Error fetching hospitals data:', error);
      setStatsLoading(false);
    } finally {
      setLoading(false);
    }
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

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
      header: 'Email',
      accessor: 'email',
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            row.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      header: 'Registered',
      accessor: 'createdAt',
      cell: (row) => formatDate(row.createdAt),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
        <p className="text-sm text-gray-500">Welcome back, Admin</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { title: 'Total Hospitals', value: stats.totalHospitals, icon: 'hospital', color: 'blue', loading: loading },
          { title: 'Active Hospitals', value: stats.activeHospitals, icon: 'check', color: 'green', loading: loading },
          { title: 'Total Doctors', value: stats.totalDoctors, icon: 'doctor', color: 'purple', loading: statsLoading },
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
                {stat.loading ? (
                  <div className="animate-pulse h-6 w-12 bg-white bg-opacity-30 rounded"></div>
                ) : (
                  <p className="text-2xl font-semibold">{stat.value}</p>
                )}
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
            to="/admin/hospitals"
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
                  <tr key={hospital._id}>
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
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;