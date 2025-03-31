import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    await logout();
    setShowDropdown(false);
  };

  return (
    <header className="bg-gray-800 text-white shadow-lg">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-bold">Item Manager</h1>
        </div>
        
        <div className="flex items-center">
          {isAuthenticated ? (
            <div className="relative">
              <button 
                className="flex items-center space-x-1 focus:outline-none"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <span className="text-sm sm:text-base">{user.username}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-x-2">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded text-sm"
                onClick={() => setShowLoginModal(true)}
              >
                Login
              </button>
              <button
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded text-sm"
                onClick={() => setShowRegisterModal(true)}
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="max-w-md w-full mx-4">
            <LoginForm onClose={() => setShowLoginModal(false)} />
            <button 
              onClick={() => setShowLoginModal(false)}
              className="mt-4 w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
      
      {/* Register Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="max-w-md w-full mx-4">
            <RegisterForm onClose={() => setShowRegisterModal(false)} />
            <button 
              onClick={() => setShowRegisterModal(false)}
              className="mt-4 w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;