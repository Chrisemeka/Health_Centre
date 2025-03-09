import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

const Header = ({ userType, showProfileLink, profileLink }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Check if we're on the landing pages
  const isLandingPage = !userType;

  // Different navigation items based on whether we're logged in or not
  const navItems = isLandingPage
    ? [
        { label: 'Home', path: '/' },
        { label: 'Services', path: '/services' },
        { label: 'About Us', path: '/about' },
        { label: 'Contact', path: '/contact' },
      ]
    : [];

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-teal-600">
                HealthCare Hospital
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            {isLandingPage && (
              <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`${
                      location.pathname === item.path
                        ? 'border-teal-500 text-gray-900'
                        : 'border-transparent text-gray-600 hover:border-teal-300 hover:text-teal-700'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            )}
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {/* Show these buttons only if on landing page */}
            {isLandingPage && (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-teal-600 hover:text-teal-800 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="bg-teal-600 text-white hover:bg-teal-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-teal-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500"
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed */}
              <svg
                className={`${mobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Icon when menu is open */}
              <svg
                className={`${mobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
        {isLandingPage ? (
          <div className="pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`${
                  location.pathname === item.path
                    ? 'bg-teal-50 border-teal-500 text-teal-700'
                    : 'border-transparent text-gray-600 hover:bg-teal-50 hover:border-teal-300 hover:text-teal-700'
                } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
              >
                {item.label}
              </Link>
            ))}
            
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="space-y-1">
                <Link
                  to="/login"
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-teal-600 hover:bg-teal-50 hover:border-teal-300 hover:text-teal-700"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-teal-600 hover:bg-teal-50 hover:border-teal-300 hover:text-teal-700"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="space-y-1">
              {showProfileLink && (
                <Link
                  to={profileLink}
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-teal-600 hover:bg-teal-50 hover:border-teal-300 hover:text-teal-700"
                >
                  My Profile
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;