import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import Header from '../../components/common/Header';
// import { useAuth } from '../contexts/AuthContext';

const PatientLayout = () => {
//   const { logout } = useAuth();
  
  const sidebarItems = [
    { label: 'Dashboard', path: '/patient/dashboard', icon: 'dashboard' },
    { label: 'Appointments', path: '/patient/appointments', icon: 'calendar' },
    { label: 'Medical Records', path: '/patient/medical-records', icon: 'folder-open' },
    { label: 'My Profile', path: '/patient/profile', icon: 'user' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar items={sidebarItems} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          userType="Patient" 
        //   onLogout={logout}
          showProfileLink={true}
          profileLink="/patient/profile"
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PatientLayout;