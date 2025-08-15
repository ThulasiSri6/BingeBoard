import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { FaBars, FaUser, FaSignOutAlt, FaBookmark, FaHome, FaDice, FaLightbulb, FaBrain } from 'react-icons/fa';
import { handleSuccess } from '../utils';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const loggedInUser = localStorage.getItem('loggedInUser');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    handleSuccess('User Logged out');
    navigate('/login');
  };

  return (
    <main classname="layoutpage">
      {/* ✅ Hamburger Always Visible */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 text-white text-3xl focus:outline-none"
      >
        <FaBars />
      </button>

      {/* ✅ Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white p-6 z-40 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300`}>
        <div className="mt-16 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <FaUser className="text-lg" />
            <div>
              <p className="font-medium">{loggedInUser || 'Guest'}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
        <button
            className="flex items-center gap-2 px-4 py-2 bg-blue-800 hover:bg-blue-900 rounded"
            onClick={() => {
              navigate('/home');
              setSidebarOpen(false);
            }}
          >
            <FaHome /> Home
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-blue-800 hover:bg-blue-900 rounded"
            onClick={() => {
              navigate('/watchlist');
              setSidebarOpen(false);
            }}
          >
            <FaBookmark /> Watchlist
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-blue-800 hover:bg-blue-900 rounded"
            onClick={() => {
              navigate('/quickpick');
              setSidebarOpen(false);
            }}
          >
            <FaDice /> Quick Pick
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-blue-800 hover:bg-blue-900 rounded"
            onClick={() => {
              navigate('/bingebytes');
              setSidebarOpen(false);
            }}
          >
            <FaLightbulb /> Binge Bytes
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-blue-800 hover:bg-blue-900 rounded"
            onClick={() => {
              navigate('/coolfacts');
              setSidebarOpen(false);
            }}
          >
            <FaBrain /> Cool Facts
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-800 hover:bg-red-900 rounded"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      {/* ✅ Main Content Goes Here */}
      <div className="pt-0 pl-0">
        <Outlet />
      </div>
    </main>
  );
};

export default MainLayout;
