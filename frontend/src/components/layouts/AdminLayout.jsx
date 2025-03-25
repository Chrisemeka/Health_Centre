import { Outlet } from 'react-router-dom';
import SideBar from '../../components/common/SideBar.jsx';
import Header from '../../components/common/Header';
// import { useAuth } from '../contexts/AuthContext';

const AdminLayout = () => {
//   const { logout } = useAuth();
  
  const sidebarItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: 'dashboard' },
    { label: 'Doctors', path: '/admin/create-doctor', icon: 'user' },
    { label: 'Hospitals', path: '/admin/hospitals', icon: 'dashboard' },
    { label: 'Logout', path: '/logout', icon: 'logout' },
    // { label: 'Patients', path: '/admin/patients', icon: 'users' },
    // { label: 'Appointments', path: '/admin/appointments', icon: 'calendar' },
    // { label: 'Reports', path: '/admin/system-logs', icon: 'clipboard-list' },
    // { label: 'Settings', path: '/admin/settings', icon: 'cog' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <SideBar items={sidebarItems} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          userType="Hospital Admin" 
        //   onLogout={logout}
          showProfileLink={false}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;