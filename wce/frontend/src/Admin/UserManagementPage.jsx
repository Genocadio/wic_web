import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from '../services/UserService';
import Filter from '../components/Filter';
import EditUserForm from '../components/EditUserForm';
import AdminNavbar from './AdminNavbar';
import { toast } from 'react-toastify';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [editUserId, setEditUserId] = useState(null);
  const [confirmDeleteUserId, setConfirmDeleteUserId] = useState(null); // Track user ID for delete confirmation
  const [isAdmin, setIsAdmin] = useState(true); // Default to admin
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
      toast.success('User deleted successfully');
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

  const handleToggleUserType = async (userId) => {
    const user = users.find(user => user.id === userId);
    const newType = user.userType === 'admin' ? 'customer' : 'admin';
    const action = newType === 'admin' ? 'make admin' : 'make customer';

    if (window.confirm(`Are you sure you want to ${action} this user?`)) {
      try {
        const updatedUser = { ...user, userType: newType };
        await UserService.update(userId, updatedUser);
        setUsers(users.map(user => (user.id === userId ? updatedUser : user)));
        toast.success(`User type updated successfully to ${newType}`);
      } catch (error) {
        console.error(`Error updating user type:`, error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          navigate('/login');
        } else {
          setError(error.message || `Error updating user type`);
        }
      }
    }
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phoneNumber.includes(searchQuery)
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
      toast.success('User updated successfully');
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
    return (
      <div className="flex w-52 flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="skeleton h-16 w-16 shrink-0 rounded-full"></div>
          <div className="flex flex-col gap-4">
            <div className="skeleton h-4 w-20"></div>
            <div className="skeleton h-4 w-28"></div>
          </div>
        </div>
        <div className="skeleton h-32 w-full"></div>
      </div>
    );
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
                  <p className="mb-2"><strong>Phone Number:</strong> {user.phoneNumber}</p>
                  <p className="mb-2"><strong>Location:</strong> {user.location}</p>

                  <div className="form-control mt-4">
                    <label className="label cursor-pointer">
                      <div className="mb-2">
                        <strong>User Type:</strong> {user.userType}
                      </div>
                      <input
                        type="checkbox"
                        className="toggle toggle-secondary"
                        checked={user.userType === 'admin'}
                        onChange={() => handleToggleUserType(user.id)}
                      />
                    </label>
                  </div>

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
                      className="btn btn-danger"
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

        {confirmDeleteUserId && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-md text-center">
              <p>Are you sure you want to delete this user?</p>
              <div className="flex justify-center mt-4 space-x-4">
                <button className="btn btn-danger" onClick={handleConfirmDelete}>Yes</button>
                <button className="btn btn-secondary" onClick={handleCancelDelete}>No</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UserManagementPage;
