import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import Header from '../../components/common/Header';

const SuperAdminLayout = () => {
//   const { logout } = useAuth();
  
  const sidebarItems = [
    { label: 'Dashboard', path: '/superadmin/dashboard', icon: 'dashboard' },
    // { label: 'Hospitals', path: '/superadmin/hospitals', icon: 'dashboard' },
    { label: 'Admins', path: '/superadmin/create-user', icon: 'user' },
    // { label: 'System Logs', path: '/superadmin/system-logs', icon: 'clipboard-list' },
    // { label: 'Settings', path: '/superadmin/settings', icon: 'cog' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar items={sidebarItems} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          userType="Super Admin" 
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

export default SuperAdminLayout;