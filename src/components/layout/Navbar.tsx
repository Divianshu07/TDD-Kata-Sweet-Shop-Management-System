import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-violet-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">

        <div className="flex flex-col">
          <span className="text-lg font-semibold text-gray-900">
            🍬 Sweet Shop
          </span>
          <span className="text-xs text-gray-500">
            Management System
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-700">
            {user?.name}
          </span>

          {user?.role === 'admin' && (
            <button
              onClick={() => navigate('/admin')}
              className="px-3 py-1 rounded-md text-sm bg-violet-100 text-violet-700 hover:bg-violet-200 transition"
            >
              Admin
            </button>
          )}

          <button
            onClick={logout}
            className="px-3 py-1 rounded-md text-sm border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
          >
            Logout
          </button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
