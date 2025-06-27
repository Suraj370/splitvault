import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { PiggyBank, User, Bell } from 'lucide-react';
import { logout } from '../../features/auth/authSlice'; // adjust path as needed

function Navbar() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    dispatch(logout());
    setOpen(false);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-xl">
              <PiggyBank className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">SavingsVault</h1>
              <p className="text-xs text-gray-500">Smart Savings Manager</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 relative" ref={dropdownRef}>
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
              <Bell className="w-5 h-5" />
            </button>

            <button
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              onClick={() => setOpen(prev => !prev)}
            >
              <User className="w-5 h-5" />
            </button>

            {open && (
              <div className="absolute right-0 top-12 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-md z-50">
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
