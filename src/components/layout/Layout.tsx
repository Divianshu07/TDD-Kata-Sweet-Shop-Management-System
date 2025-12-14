import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-lavender-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <Outlet />
      </main>

      <footer className="text-center text-sm text-gray-500 py-6">
        © {new Date().getFullYear()} Sweet Shop Management System ·{' '}
        <span className="font-semibold text-gray-700">
          Divianshu Chandel
        </span>
      </footer>
    </div>
  );
};

export default Layout;
