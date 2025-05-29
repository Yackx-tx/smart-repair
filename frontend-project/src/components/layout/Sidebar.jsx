import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const location = useLocation();

  const onLogout = () => {
    logout();
  };

  const authLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/cars', label: 'Cars' },
    { to: '/services', label: 'Services' },
    { to: '/service-records', label: 'Records' },
    { to: '/reports', label: 'Reports' }
  ];

  const guestLinks = [
    { to: '/login', label: 'Login' },
    { to: '/register', label: 'Register' }
  ];

  const links = isAuthenticated ? authLinks : guestLinks;

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-green-900 text-white z-30 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:inset-0 w-64 flex flex-col transition-transform duration-300 ease-in-out`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-green-800">
          <Link to="/" className="text-xl font-bold text-white">
            SmartPark CRPMS
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => window.innerWidth < 1024 && toggleSidebar()}
              className={`block px-4 py-3 rounded transition-colors duration-200 ${
                location.pathname === link.to
                  ? 'bg-green-700 text-white'
                  : 'text-white hover:bg-green-800'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Logout Button (only for authenticated users) */}
        {isAuthenticated && (
          <div className="p-4 border-t border-green-800">
            <button
              onClick={onLogout}
              className="w-full px-4 py-3 text-white bg-red-600 hover:bg-red-700 rounded transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;
