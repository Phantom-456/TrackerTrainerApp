import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname.startsWith(path) ? 
      'bg-pink-600 text-white' : 
      'text-gray-700 dark:text-gray-200 hover:bg-pink-100 dark:hover:bg-pink-900';
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                AI Life Trainer
              </span>
            </div>

            <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
              <Link
                to="/punch"
                className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive('/punch')}`}
              >
                <i className="fas fa-dumbbell mr-2"></i>
                Make a Punch
              </Link>

              <Link
                to="/charts"
                className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive('/charts')}`}
              >
                <i className="fas fa-chart-line mr-2"></i>
                Analytics
              </Link>

              <Link
                to="/trainer"
                className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive('/trainer')}`}
              >
                <i className="fas fa-robot mr-2"></i>
                AI Trainer
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-pink-500"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <i className="fas fa-bars"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="sm:hidden" id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            to="/punch"
            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/punch')}`}
          >
            <i className="fas fa-dumbbell mr-2"></i>
            Make a Punch
          </Link>

          <Link
            to="/charts"
            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/charts')}`}
          >
            <i className="fas fa-chart-line mr-2"></i>
            Analytics
          </Link>

          <Link
            to="/trainer"
            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/trainer')}`}
          >
            <i className="fas fa-robot mr-2"></i>
            AI Trainer
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
