import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';


const PatientDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({firstName: '', lastName: ''});
  const [stats, setStats] = useState({
    totalAppointments: 0,
    totalRecords: 0,
    confirmedAppointments: 0,
    unreadNotifications: 0
  });
  
  // For upcoming appointments
  const [appointments, setAppointments] = useState([]);
  
  // For recent medical records
  const [recentRecords, setRecentRecords] = useState([]);
  
  // For notifications
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    
    try {
      // Get user data from localStorage
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        setUser(user);
      }

      // Fetch data in parallel
      const [
        appointmentsResponse
      ] = await Promise.all([
        api.get('/api/patient/appointments')
      ]);

      // Set appointments (all appointments)
      const allAppointments = appointmentsResponse.data || [];
      
      // Filter for confirmed appointments
      const confirmedAppointments = allAppointments.filter(
        appointment => appointment.status === 'Confirmed' || appointment.status === 'confirmed'
      );
      
      // Count of confirmed appointments - calculated from appointments data
      const confirmedCount = confirmedAppointments.length;
      
      // Set appointments for the table
      setAppointments(confirmedAppointments);
      
      // Mock medical records data since the API call is commented out
      const records = [];
      
      // Create notifications based on upcoming appointments
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to beginning of the day for proper comparison
      
      const upcomingAppointments = allAppointments.filter(appointment => {
        if (!appointment.date) return false;
        const appointmentDate = new Date(appointment.date);
        appointmentDate.setHours(0, 0, 0, 0); // Set to beginning of the day for proper comparison
        return appointmentDate > today; // Only show appointments with dates greater than current date
      });
      
      // Sort upcoming appointments by date
      upcomingAppointments.sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
      });
      
      // Convert appointments to notifications
      const appointmentNotifications = upcomingAppointments.map((appointment, index) => {
        const appointmentDate = new Date(appointment.date);
        appointmentDate.setHours(0, 0, 0, 0);
        const diffDays = Math.round((appointmentDate - today) / (1000 * 60 * 60 * 24));
        
        let timeString = '';
        if (diffDays === 0) {
          timeString = 'Today';
        } else if (diffDays === 1) {
          timeString = 'Tomorrow';
        } else {
          timeString = `In ${diffDays} days`;
        }
        
        return {
          id: index + 1,
          message: `Upcoming appointment with ${appointment.doctorName || appointment.doctorId || 'Doctor'} at ${appointment.hospitalName || appointment.hospital || 'Hospital'}`,
          time: `${timeString} (${appointment.date || 'Date not set'} at ${appointment.time || 'Time not set'})`,
          read: false,
          appointmentId: appointment._id || appointment.id
        };
      });
      
      setNotifications(appointmentNotifications);
      
      // Set stats - using the calculated confirmed count
      setStats({
        totalAppointments: allAppointments.length,
        totalRecords: records.length,
        confirmedAppointments: confirmedCount,
        unreadNotifications: appointmentNotifications.filter(n => !n.read).length
      });
      
      console.log('Stats updated:', {
        totalAppointments: allAppointments.length,
        totalRecords: records.length,
        confirmedAppointments: confirmedCount,
        unreadNotifications: appointmentNotifications.filter(n => !n.read).length
      });
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      
      // Set default stats in case of error
      setStats({
        totalAppointments: 0,
        totalRecords: 0,
        confirmedAppointments: 0,
        unreadNotifications: 0
      });
    } finally {
      setLoading(false);
    }
  };

  // Mark notification as read
  // const handleMarkAsRead = (notificationId) => {
  //   setNotifications(
  //     notifications.map((notification) =>
  //       notification.id === notificationId
  //         ? { ...notification, read: true }
  //         : notification
  //     )
  //   );
    
  //   // Update the unread notifications count in stats
  //   setStats({
  //     ...stats,
  //     unreadNotifications: notifications.filter(n => !n.read && n.id !== notificationId).length
  //   });
  // };

  // Mark all notifications as read
  // const handleMarkAllAsRead = () => {
  //   setNotifications(
  //     notifications.map((notification) => ({
  //       ...notification,
  //       read: true,
  //     }))
  //   );
    
  //   // Update the unread notifications count in stats
  //   setStats({
  //     ...stats,
  //     unreadNotifications: 0
  //   });
  // };

  // Format user name safely
  const getUserName = () => {
    if (!user) return 'Patient';
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    return `${firstName} ${lastName}`.trim() || 'Patient';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">Patient Dashboard</h1>
          <p className="text-sm text-gray-500">
            Welcome back, {getUserName()}
          </p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-teal-200 bg-opacity-30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-teal-100">Total Appointments</p>
                <p className="text-2xl font-semibold">{stats.totalAppointments}</p>
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
                <p className="text-sm font-medium text-purple-100">Confirmed Appointments</p>
                <p className="text-2xl font-semibold">{stats.confirmedAppointments}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white shadow-md rounded-lg p-6 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Confirmed Appointments</h2>
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
                {appointments.map((appointment, index) => (
                  <tr key={appointment._id || appointment.id || index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {appointment.doctorName || appointment.doctorId || 'Not specified'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {appointment.hospitalName || appointment.hospital || 'Not specified'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {appointment.date || 'Not specified'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {appointment.time || 'Not specified'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {appointment.purpose || 'Not specified'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          appointment.status === 'Confirmed' || appointment.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {appointment.status || 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <p>No confirmed appointments.</p>
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
                {recentRecords.slice(0, 5).map((record, index) => (
                  <tr key={record._id || record.id || index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.type || 'Not specified'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.hospital || record.hospitalName || 'Not specified'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.date || (record.timestamp || record.createdAt ? new Date(record.timestamp || record.createdAt).toLocaleDateString() : 'Not specified')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.doctor || record.doctorName || 'Not specified'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.summary || record.description || "No summary available"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <Link to={`/patient/medical-records/${record._id || record.id || index}`}>
                        <button className="px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500">
                          View
                        </button>
                      </Link>
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

        {/* Notifications - Showing upcoming appointments */}
        <div className="bg-white shadow-md rounded-lg p-6 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Upcoming Appointments</h2>
            {/* <button
              onClick={handleMarkAllAsRead}
              disabled={!notifications.some(n => !n.read)}
              className="px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
            >
              Mark All as Read
            </button> */}
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
                      {/* <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                      >
                        Mark as Read
                      </button> */}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <p>No upcoming appointments.</p>
              <Link to="/patient/appointments">
                <button className="px-3 py-1 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 mt-2">
                  Schedule an Appointment
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;