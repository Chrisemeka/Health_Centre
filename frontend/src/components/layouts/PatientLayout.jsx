import { Outlet } from 'react-router-dom';
import SideBar from '../../components/common/SideBar.jsx';
import Header from '../../components/common/Header.jsx';
// import { useAuth } from '../contexts/AuthContext';

const PatientLayout = () => {
//   const { logout } = useAuth();
  
  const sidebarItems = [
    { label: 'Dashboard', path: '/patient/dashboard', icon: 'dashboard' },
    { label: 'Appointments', path: '/patient/appointments', icon: 'calendar' },
    { label: 'Medical Records', path: '/patient/medical-records', icon: 'folder-open' },
    { label: 'My Profile', path: '/patient/profile', icon: 'user' },
    { label: 'Logout', path: '/logout', icon: 'logout' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <SideBar items={sidebarItems} />
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