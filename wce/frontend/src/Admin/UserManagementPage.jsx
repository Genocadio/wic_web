import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from '../services/UserService';
import Filter from '../components/Filter';
import EditUserForm from '../components/EditUserForm';
import AdminNavbar from './AdminNavbar'

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [editUserId, setEditUserId] = useState(null);
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
        console.log(usersData);
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
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await UserService.remove(userId);
        setUsers(users.filter(user => user.id !== userId));
      } catch (error) {
        console.error('Error deleting user:', error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          navigate('/login');
        } else {
          setError(error.message || 'Error deleting user');
        }
      }
    }
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
    return <p>Loading users...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <><AdminNavbar /><div className="container mx-auto py-4 px-2 sm:px-6 lg:px-24">
      <h1 className="text-center text-4xl font-bold mb-10 text-gray-800">User Management</h1>
      <div className="mb-6 flex flex-col lg:flex-row items-center justify-between">
        <div className="w-full lg:w-3/4 lg:pl-4">
          <Filter searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
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
                    className="bg-blue-500 text-white py-2 px-4 rounded"
                    onClick={() => enterEditMode(user.id)}
                  >
                    Edit
                  </button>
                  <button
                    className={`${user.status === 'active' ? 'bg-yellow-500' : 'bg-green-500'} text-white py-2 px-4 rounded`}
                    onClick={() => handleToggleUserStatus(user.id)}
                  >
                    {user.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    className="bg-red-500 text-white py-2 px-4 rounded"
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
    </div></>
  );
};

export default UserManagementPage;
