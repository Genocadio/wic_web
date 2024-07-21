import React, { useState, useEffect } from 'react';
import UserService from '../services/UserService';
import AdminNavbar from '../Admin/AdminNavbar';
import { toast } from 'react-toastify';
import MessageForm from '../User/MessageForm';

const UserDetails = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editPasswordMode, setEditPasswordMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    location: '',
  });
  const [passwordFormData, setPasswordFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [showMessageForm, setShowMessageForm] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (storedUser) {
      setLoggedInUser(storedUser);
    }
  }, []);

  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoading(true);
      try {
        if (loggedInUser) {
          UserService.setToken(loggedInUser.token);
          const fetchedUser = await UserService.getById(loggedInUser.id);
          setUser(fetchedUser);
          setLoading(false);
          setFormData({
            firstName: fetchedUser.firstName || '',
            lastName: fetchedUser.lastName || '',
            phoneNumber: fetchedUser.phoneNumber || '',
            location: fetchedUser.location || '',
          });
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [loggedInUser]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordFormData({
      ...passwordFormData,
      [e.target.name]: e.target.value,
    });
  };

  const isValidPassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return password.length >= minLength && hasUpperCase && hasLowerCase && hasDigit && hasSpecialChar;
  };

  const handleEditSave = async () => {
    try {
      if (loggedInUser) {
        UserService.setToken(loggedInUser.token);
        const updatedUser = await UserService.update(loggedInUser.id, formData);
        setUser(updatedUser);
        setEditMode(false);
        toast.success('Updated your user information');
      }
    } catch (error) {
      console.error('Error updating user details:', error);
    }
  };

  const handleChangePassword = async () => {
    try {
      if (!loggedInUser) {
        return;
      }

      const { newPassword, confirmPassword } = passwordFormData;

      if (newPassword !== confirmPassword) {
        toast.error('Passwords do not match.');
        return;
      }

      if (!isValidPassword(newPassword)) {
        toast.error('Password does not meet criteria.');
        return;
      }

      UserService.setToken(loggedInUser.token);
      const updatedUser = await UserService.update(loggedInUser.id, { password: newPassword });
      setUser(updatedUser);
      toast.success('Password updated successfully.');
      setEditPasswordMode(false);
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error('Error updating password. Please try again.');
    }
  };

  const handleMessageCreated = (newMessage) => {
    setShowMessageForm(false);
  };

  if (loading) {
    return <p>Loading user details...</p>;
  }

  if (!user) {
    return <p>User not found.</p>;
  }

  return (
    <>
      <AdminNavbar />
      <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8 min-h-screen">
        <h1 className="text-2xl font-bold mb-4">User Details</h1>
        {!editMode ? (
          <div className="space-y-4">
            <div>
              <strong>First Name:</strong> {user.firstName}
            </div>
            <div>
              <strong>Last Name:</strong> {user.lastName}
            </div>
            <div>
              <strong>Email:</strong> {user.email}
            </div>
            <div>
              <strong>Phone Number:</strong> {user.phoneNumber}
            </div>
            <div>
              <strong>Location:</strong> {user.location}
            </div>
            <div className="space-x-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => setEditMode(true)}
              >
                Edit
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => setEditPasswordMode(true)}
              >
                Change Password
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => setShowMessageForm(true)}
              >
                Create Message
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label htmlFor="firstName" className="block">
                First Name:
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="border rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>
            </div>
            <div>
              <label htmlFor="lastName" className="block">
                Last Name:
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="border rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>
            </div>
            <div>
              <label htmlFor="email" className="block">
                Email:
                <input
                  type="text"
                  id="email"
                  name="email"
                  value={user.email}
                  readOnly
                  className="border rounded px-3 py-2 mt-1 bg-gray-100"
                />
              </label>
            </div>
            <div>
              <label htmlFor="phoneNumber" className="block">
                Phone Number:
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="border rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>
            </div>
            <div>
              <label htmlFor="location" className="block">
                Location:
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="border rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>
            </div>
            <div className="space-x-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={handleEditSave}
              >
                Save
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                onClick={() => setEditMode(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {editPasswordMode && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Change Password</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="newPassword" className="block">
                  New Password:
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={passwordFormData.newPassword}
                    onChange={handlePasswordChange}
                    className="border rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block">
                  Confirm Password:
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordFormData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="border rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>
              </div>
              <div className="space-x-4">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  onClick={handleChangePassword}
                >
                  Save
                </button>
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  onClick={() => setEditPasswordMode(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {showMessageForm && (
          <MessageForm
            userId={loggedInUser.id}
            onMessageCreated={handleMessageCreated}
            onCancel={() => setShowMessageForm(false)}
          />
        )}
      </div>
    </>
  );
};

export default UserDetails;
