import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from '../services/UserService';
import Filter from '../components/Filter';
import EditUserForm from '../components/EditUserForm';
import AdminNavbar from './AdminNavbar';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [editUserId, setEditUserId] = useState(null);
  const [confirmDeleteUserId, setConfirmDeleteUserId] = useState(null); // Track user ID for delete confirmation
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        if (!loggedInUser) {
          throw new Error('loggedInUser is null');
        }

        const token = loggedInUser.token;
        UserService.setToken(token);

        const usersData = await UserService.getAll();
        if (Array.isArray(usersData)) {
          setUsers(usersData);
        } else {
          throw new Error('Invalid data format');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        if (error.message === 'loggedInUser is null' || error.response?.status === 401 || error.response?.status === 403) {
          navigate('/login');
        } else {
          setError(error.message || 'Error fetching users');
        }
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  const handleDeleteUser = async (userId) => {
    setConfirmDeleteUserId(userId); // Set the userId to confirm deletion
  };

  const handleConfirmDelete = async () => {
    try {
      await UserService.remove(confirmDeleteUserId);
      setUsers(users.filter(user => user.id !== confirmDeleteUserId));
      setConfirmDeleteUserId(null); // Clear confirmation state
    } catch (error) {
      console.error('Error deleting user:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        navigate('/login');
      } else {
        setError(error.message || 'Error deleting user');
      }
    }
  };

  const handleCancelDelete = () => {
    setConfirmDeleteUserId(null); // Clear confirmation state
  };

  const handleToggleUserStatus = async (userId) => {
    const user = users.find(user => user.id === userId);
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    const action = newStatus === 'active' ? 'activate' : 'deactivate';

    if (window.confirm(`Are you sure you want to ${action} this user?`)) {
      try {
        const updatedUser = { ...user, status: newStatus };
        await UserService.update(userId, updatedUser);
        setUsers(users.map(user => (user.id === userId ? updatedUser : user)));
      } catch (error) {
        console.error(`Error ${action}ing user:`, error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          navigate('/login');
        } else {
          setError(error.message || `Error ${action}ing user`);
        }
      }
    }
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const enterEditMode = (userId) => {
    setEditUserId(userId);
  };

  const exitEditMode = () => {
    setEditUserId(null);
  };

  const handleEditUser = async (editedUser) => {
    try {
      const userWithId = { ...editedUser, id: editUserId };
      await UserService.update(userWithId.id, userWithId);
      setUsers(users.map(user => (user.id === userWithId.id ? userWithId : user)));
      exitEditMode();
    } catch (error) {
      console.error('Error editing user:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      } else {
        setError(error.message || 'Error editing user');
      }
    }
  };

  if (loading) {
    return (<div class="flex w-52 flex-col gap-4">
      <div class="flex items-center gap-4">
        <div class="skeleton h-16 w-16 shrink-0 rounded-full"></div>
        <div class="flex flex-col gap-4">
          <div class="skeleton h-4 w-20"></div>
          <div class="skeleton h-4 w-28"></div>
        </div>
      </div>
      <div class="skeleton h-32 w-full"></div>
    </div>)
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <>
      <AdminNavbar />
      <div className="container mx-auto py-4 px-2 sm:px-6 lg:px-24 min-h-screen">
        <h1 className="text-center text-4xl font-bold mb-10 text-gray-800">User Management</h1>
        <div className="mb-6 flex flex-col lg:flex-row items-center justify-between">
          <div className="w-full lg:w-3/4 lg:pl-4">
            <Filter searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          </div>
          <div className="flex justify-end">
            <button
              className="btn btn-primary mr-4"
              onClick={() => navigate('/register')}
            >
              Add User
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredUsers.map(user => (
            <div key={user.id} className="bg-white shadow-md rounded-lg p-4">
              {editUserId === user.id ? (
                <EditUserForm user={user} onSave={handleEditUser} onCancel={exitEditMode} />
              ) : (
                <>
                  <h2 className="text-xl font-semibold mb-2">{user.firstName} {user.lastName}</h2>
                  <p className="mb-2"><strong>Email:</strong> {user.email}</p>
                  <p className="mb-2"><strong>Location:</strong> {user.location}</p>
                  <p className="mb-2"><strong>Type:</strong> {user.userType}</p>
                  <p className="mb-2"><strong>Status:</strong> {user.status}</p>
                  <div className="flex space-x-4 mt-4">
                    <button
                      className="btn btn-primary"
                      onClick={() => enterEditMode(user.id)}
                    >
                      Edit
                    </button>
                    <button
                      className={`btn ${user.status === 'active' ? 'btn-warning' : 'btn-success'}`}
                      onClick={() => handleToggleUserStatus(user.id)}
                    >
                      {user.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      className="btn btn-error"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmDeleteUserId && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-4 w-64">
            <p className="text-gray-900 text-sm font-medium mb-2">Are you sure you want to delete this user?</p>
            <div className="flex justify-end">
              <button
                onClick={handleConfirmDelete}
                className="btn btn-error mr-2"
              >
                Yes
              </button>
              <button
                onClick={handleCancelDelete}
                className="btn btn-secondary"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserManagementPage;
