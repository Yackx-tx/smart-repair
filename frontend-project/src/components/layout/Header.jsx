import { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const Header = ({ toggleSidebar }) => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const location = useLocation();

  // Get page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;
    switch (path) {
      case '/dashboard':
        return 'Dashboard';
      case '/cars':
        return 'Cars Management';
      case '/services':
        return 'Services Management';
      case '/service-records':
        return 'Service Records';
      case '/reports':
        return 'Reports';
      case '/login':
        return 'Login';
      case '/register':
        return 'Register';
      default:
        return 'SmartPark CRPMS';
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-6 shadow-sm">
      {/* Left side - Menu button and page title */}
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded text-green-900 hover:text-green-700 hover:bg-green-50 lg:hidden transition-colors duration-200"
        >
          ☰
        </button>
        
        <h1 className="ml-2 lg:ml-0 text-xl font-semibold text-green-900">
          {getPageTitle()}
        </h1>
      </div>

      {/* Right side - User info */}
      {isAuthenticated && user && (
        <div className="flex items-center space-x-4">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-green-900">
              Welcome, {user.username}
            </p>
            <p className="text-xs text-green-700">
              {user.role || 'User'}
            </p>
          </div>
          
          <div className="h-8 w-8 bg-green-800 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-white">
              {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
            </span>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
