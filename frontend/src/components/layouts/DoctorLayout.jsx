import { Outlet } from 'react-router-dom';
import SideBar from '../../components/common/SideBar.jsx';
import Header from '../../components/common/Header';
// import { useAuth } from '../contexts/AuthContext';

const DoctorLayout = () => {
//   const { logout } = useAuth();
  
  const sidebarItems = [
    { label: 'Dashboard', path: '/doctor/dashboard', icon: 'dashboard' },
    { label: 'Appointments', path: '/doctor/appointments', icon: 'calendar' },
    { label: 'Patient Records', path: '/doctor/patient-records', icon: 'folder-open' },
    { label: 'Logout', path: '/logout', icon: 'logout' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <SideBar items={sidebarItems} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          userType="Doctor" 
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

export default DoctorLayout;
