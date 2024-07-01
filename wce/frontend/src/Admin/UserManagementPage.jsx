import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from '../services/UserService';
import Filter from '../components/Filter';
import EditUserForm from '../components/EditUserForm'; // Import the EditUserForm component

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [editUserId, setEditUserId] = useState(null); // State to track which user is in edit mode
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
        if (error.message === 'loggedInUser is null' || error.response?.status === 401) {
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
    try {
      await UserService.remove(userId);
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      } else {
        setError(error.message || 'Error deleting user');
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
      await UserService.update(editedUser.id, editedUser);
      // Update local state to reflect changes
      setUsers(users.map(user => (user.id === editedUser.id ? editedUser : user)));
      exitEditMode(); // Exit edit mode after successful update
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
    <div className="container mx-auto py-4 px-2 sm:px-6 lg:px-24">
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
    </div>
  );
};

export default UserManagementPage;
