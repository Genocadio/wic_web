import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import UserService from '../services/UserService';
import Filter from '../components/Filter';
import EditUserForm from '../components/EditUserForm';
import AdminNavbar from './AdminNavbar';
import { toast } from 'react-toastify';

const fetchUsers = async () => {
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  if (!loggedInUser) throw new Error('loggedInUser is null');
  UserService.setToken(loggedInUser.token);

  const usersData = await UserService.getAll();
  if (!Array.isArray(usersData)) throw new Error('Invalid data format');
  return usersData;
};

const deleteUser = async (userId) => {
  await UserService.remove(userId);
};

const updateUser = async (user) => {
  await UserService.update(user.id, user);
};

const UserManagementPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editUserId, setEditUserId] = useState(null);
  const [confirmDeleteUserId, setConfirmDeleteUserId] = useState(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: users = [], isLoading, isError, error } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    onError: (error) => {
      if (error.message === 'loggedInUser is null' || error.response?.status === 401 || error.response?.status === 403) {
        navigate('/login');
      } else {
        toast.error(error.message || 'Error fetching users');
      }
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      toast.success('User deleted successfully');
      setConfirmDeleteUserId(null);
    },
    onError: (error) => {
      if (error.response?.status === 401 || error.response?.status === 403) {
        navigate('/login');
      } else {
        toast.error(error.message || 'Error deleting user');
      }
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      toast.success('User updated successfully');
      setEditUserId(null);
    },
    onError: (error) => {
      if (error.response?.status === 401) {
        navigate('/login');
      } else {
        toast.error(error.message || 'Error editing user');
      }
    },
  });

  const handleDeleteUser = (userId) => {
    setConfirmDeleteUserId(userId);
  };

  const handleConfirmDelete = () => {
    deleteUserMutation.mutate(confirmDeleteUserId);
  };

  const handleCancelDelete = () => {
    setConfirmDeleteUserId(null);
  };

  const handleToggleUserStatus = (userId) => {
    const user = users.find(user => user.id === userId);
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    const action = newStatus === 'active' ? 'activate' : 'deactivate';

    if (window.confirm(`Are you sure you want to ${action} this user?`)) {
      updateUserMutation.mutate({ ...user, status: newStatus });
    }
  };

  const handleToggleUserType = (userId) => {
    const user = users.find(user => user.id === userId);
    const newType = user.userType === 'admin' ? 'customer' : 'admin';
    const action = newType === 'admin' ? 'make admin' : 'make customer';

    if (window.confirm(`Are you sure you want to ${action} this user?`)) {
      updateUserMutation.mutate({ ...user, userType: newType });
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

  const handleEditUser = (editedUser) => {
    updateUserMutation.mutate(editedUser);
  };

  if (isLoading) {
    return (
      <>
        <AdminNavbar />
        <div className="container mx-auto py-4 px-2 min-h-screen sm:px-6 lg:px-24">
          <div className="overflow-x-auto lg:mx-6">
            <table className="min-w-full bg-white rounded-lg overflow-hidden shadow">
              <tbody>
                {Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                    <td className="py-2 px-4"><div className="skeleton h-4 w-full"></div></td>
                    <td className="py-2 px-4"><div className="skeleton h-4 w-full"></div></td>
                    <td className="py-2 px-4"><div className="skeleton h-4 w-full"></div></td>
                    <td className="py-2 px-4"><div className="skeleton h-4 w-full"></div></td>
                    <td className="py-2 px-4"><div className="skeleton h-4 w-full"></div></td>
                    <td className="py-2 px-4">
                      <div className="skeleton h-4 w-1/2"></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  }

  if (isError) {
    return <p>Error: {error.message}</p>;
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
                  <div className="flex flex-wrap gap-4 mt-4">
                    <button
                      className="btn btn-primary flex-grow sm:flex-grow-0"
                      onClick={() => enterEditMode(user.id)}
                    >
                      Edit
                    </button>
                    <button
                      className={`btn ${user.status === 'active' ? 'btn-warning' : 'btn-success'} flex-grow sm:flex-grow-0`}
                      onClick={() => handleToggleUserStatus(user.id)}
                    >
                      {user.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      className="btn btn-danger flex-grow sm:flex-grow-0"
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
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-700 bg-opacity-50">
            <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full">
              <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
              <p className="mb-4">Are you sure you want to delete this user? This action cannot be undone.</p>
              <div className="flex justify-end gap-4">
                <button
                  className="btn btn-danger"
                  onClick={handleConfirmDelete}
                >
                  Yes, Delete
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={handleCancelDelete}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UserManagementPage;
