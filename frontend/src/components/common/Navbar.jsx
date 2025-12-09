import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  if (!user) return null;

  return (
    <nav className="bg-primary-600 dark:bg-gray-800 shadow-lg transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className="text-white text-xl font-bold hover:text-primary-100">
              Weekly Skill Tracker
            </Link>

            <div className="hidden md:flex space-x-4">
              <Link
                to="/dashboard"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/dashboard')
                    ? 'bg-primary-700 dark:bg-gray-700 text-white'
                    : 'text-white hover:bg-primary-700 dark:hover:bg-gray-700'
                }`}
              >
                Dashboard
              </Link>

              <Link
                to="/skills"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/skills')
                    ? 'bg-primary-700 dark:bg-gray-700 text-white'
                    : 'text-white hover:bg-primary-700 dark:hover:bg-gray-700'
                }`}
              >
                Skills
              </Link>

              <Link
                to="/progress"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/progress')
                    ? 'bg-primary-700 dark:bg-gray-700 text-white'
                    : 'text-white hover:bg-primary-700 dark:hover:bg-gray-700'
                }`}
              >
                Progress
              </Link>

              <Link
                to="/reports"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/reports')
                    ? 'bg-primary-700 dark:bg-gray-700 text-white'
                    : 'text-white hover:bg-primary-700 dark:hover:bg-gray-700'
                }`}
              >
                Reports
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-primary-700 dark:bg-gray-700 hover:bg-primary-800 dark:hover:bg-gray-600 transition-colors"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? (
                <svg className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-200" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>

            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-white text-sm font-medium">{user.name}</p>
                <p className="text-primary-200 dark:text-gray-400 text-xs capitalize">{user.role}</p>
              </div>

              <Link
                to="/profile"
                className="w-10 h-10 rounded-full bg-primary-700 dark:bg-gray-700 flex items-center justify-center text-white font-bold hover:bg-primary-800 dark:hover:bg-gray-600 transition-colors"
              >
                {user.name?.charAt(0).toUpperCase()}
              </Link>

              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
