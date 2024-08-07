import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import Toast from '../components/Toast';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <>
      <AdminNavbar />
      <Toast />
      <div className="min-h-screen bg-gray-100 bg-opacity-50 flex items-center justify-center">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Manage Services Box */}
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-2">Manage Services</h2>
            <p className="text-gray-700 mb-4">View and manage all services.</p>
            <button
              className="w-full p-3 bg-blue-500 text-white font-bold rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              onClick={() => handleNavigation('/manage-services')}
            >
              Manage Services
            </button>
          </div>

          {/* Manage Orders Box */}
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-2">Manage Orders</h2>
            <p className="text-gray-700 mb-4">View and manage all orders.</p>
            <button
              className="w-full p-3 bg-blue-500 text-white font-bold rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              onClick={() => handleNavigation('/manage-orders')}
            >
              Manage Orders
            </button>
          </div>

          {/* Manage Users Box */}
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-2">Manage Users</h2>
            <p className="text-gray-700 mb-4">View and manage all users.</p>
            <button
              className="w-full p-3 bg-blue-500 text-white font-bold rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              onClick={() => handleNavigation('/manage-users')}
            >
              Manage Users
            </button>
          </div>

          {/* Add User Box */}
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-2">Add User</h2>
            <p className="text-gray-700 mb-4">Add a new user to the system.</p>
            <button
              className="w-full p-3 bg-blue-500 text-white font-bold rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              onClick={() => handleNavigation('/register')}
            >
              Add User
            </button>
          </div>

          {/* Add Service Box */}
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-2">Add Service</h2>
            <p className="text-gray-700 mb-4">Add a new service to the system.</p>
            <button
              className="w-full p-3 bg-blue-500 text-white font-bold rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              onClick={() => handleNavigation('/add-service')}
            >
              Add Service
            </button>
          </div>

          {/* Manage Notifications Box */}
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-2">Manage Notifications</h2>
            <p className="text-gray-700 mb-4">View and manage all notifications.</p>
            <button
              className="w-full p-3 bg-blue-500 text-white font-bold rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              onClick={() => handleNavigation('/notices')}
            >
              Manage Notifications
            </button>
          </div>

          {/* Manage Messages Box */}
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-2">Manage Messages</h2>
            <p className="text-gray-700 mb-4">View and manage all messages.</p>
            <button
              className="w-full p-3 bg-blue-500 text-white font-bold rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              onClick={() => handleNavigation('/messages')}
            >
              Manage Messages
            </button>
          </div>
          {/* Export Data Box */}
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-2">Data</h2>
            <p className="text-gray-700 mb-4">Manage data</p>
            <button
              className="w-full p-3 bg-blue-500 text-white font-bold rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              onClick={() => handleNavigation('/data-export')}
            >
              Data
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
