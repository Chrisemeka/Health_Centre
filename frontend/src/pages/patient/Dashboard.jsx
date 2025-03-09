import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const PatientDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    upcomingAppointments: 0,
    totalRecords: 0,
    recentDoctorVisits: 0,
    notifications: 0
  });
  
  // Mock data for upcoming appointments
  const [appointments, setAppointments] = useState([]);
  
  // Mock data for recent medical records
  const [recentRecords, setRecentRecords] = useState([]);
  
  // Mock data for notifications
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Simulate API call to fetch dashboard data
    const fetchDashboardData = async () => {
      setLoading(true);
      
      try {
        // In a real app, these would be API calls
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        setStats({
          upcomingAppointments: 2,
          totalRecords: 15,
          recentDoctorVisits: 3,
          notifications: 4
        });
        
        setAppointments([
          {
            id: 1,
            doctor: 'Dr. Sarah Johnson',
            hospital: 'Central Hospital',
            date: '2025-03-15',
            time: '09:30 AM',
            purpose: 'Annual Checkup',
            status: 'Confirmed'
          },
          {
            id: 2,
            doctor: 'Dr. Michael Chen',
            hospital: 'City Medical Center',
            date: '2025-04-02',
            time: '11:00 AM',
            purpose: 'Follow-up Consultation',
            status: 'Pending'
          }
        ]);
        
        setRecentRecords([
          {
            id: 1,
            type: 'Laboratory Results',
            hospital: 'Central Hospital',
            date: '2025-02-28',
            doctor: 'Dr. Sarah Johnson',
            summary: 'Blood work results - all normal'
          },
          {
            id: 2,
            type: 'Prescription',
            hospital: 'City Medical Center',
            date: '2025-02-15',
            doctor: 'Dr. Michael Chen',
            summary: 'Prescription for hypertension medication'
          },
          {
            id: 3,
            type: 'Diagnosis',
            hospital: 'Central Hospital',
            date: '2025-01-20',
            doctor: 'Dr. Sarah Johnson',
            summary: 'Seasonal allergies diagnosis and treatment plan'
          }
        ]);
        
        setNotifications([
          {
            id: 1,
            message: 'Dr. Johnson updated your medical record',
            time: '2 hours ago',
            read: false
          },
          {
            id: 2,
            message: 'Your upcoming appointment with Dr. Chen has been confirmed',
            time: '1 day ago',
            read: false
          },
          {
            id: 3,
            message: 'New laboratory results are available for review',
            time: '3 days ago',
            read: true
          },
          {
            id: 4,
            message: 'Your prescription has been renewed by Dr. Johnson',
            time: '1 week ago',
            read: true
          }
        ]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  // Mark notification as read
  const handleMarkAsRead = (notificationId) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  // Mark all notifications as read
  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">Patient Dashboard</h1>
          <p className="text-sm text-gray-500">
            Welcome back, Patient
          </p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-teal-200 bg-opacity-30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-teal-100">Upcoming Appointments</p>
                <p className="text-2xl font-semibold">{stats.upcomingAppointments}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-200 bg-opacity-30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-green-100">Total Medical Records</p>
                <p className="text-2xl font-semibold">{stats.totalRecords}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-200 bg-opacity-30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-purple-100">Recent Doctor Visits</p>
                <p className="text-2xl font-semibold">{stats.recentDoctorVisits}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-200 bg-opacity-30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-blue-100">Notifications</p>
                <p className="text-2xl font-semibold">{notifications.filter(n => !n.read).length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white shadow-md rounded-lg p-6 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Upcoming Appointments</h2>
            <Link to="/patient/appointments">
              <button className="px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500">
                View All
              </button>
            </Link>
          </div>
          {loading ? (
            <div className="flex justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
            </div>
          ) : appointments.length > 0 ? (
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
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {appointment.doctor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {appointment.hospital}
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
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          appointment.status === 'Confirmed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <p>No upcoming appointments.</p>
              <Link to="/patient/appointments">
                <button className="px-3 py-1 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 mt-2">
                  Schedule Now
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Recent Medical Records */}
        <div className="bg-white shadow-md rounded-lg p-6 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Medical Records</h2>
            <Link to="/patient/medical-records">
              <button className="px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500">
                View All
              </button>
            </Link>
          </div>
          {loading ? (
            <div className="flex justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
            </div>
          ) : recentRecords.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hospital
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doctor
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Summary
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentRecords.map((record) => (
                  <tr key={record.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.hospital}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.doctor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.summary}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <button className="px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <p>No medical records found.</p>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="bg-white shadow-md rounded-lg p-6 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Notifications</h2>
            <button
              onClick={handleMarkAllAsRead}
              disabled={!notifications.some(n => !n.read)}
              className="px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
            >
              Mark All as Read
            </button>
          </div>
          {loading ? (
            <div className="flex justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
            </div>
          ) : notifications.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`py-4 flex items-start ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    <div className={`h-3 w-3 rounded-full ${!notification.read ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm text-gray-900">{notification.message}</p>
                    <p className="mt-1 text-xs text-gray-500">{notification.time}</p>
                  </div>
                  {!notification.read && (
                    <div className="ml-4 flex-shrink-0">
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                      >
                        Mark as Read
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <p>No notifications.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;