import React, { useState, useEffect } from 'react';
import UserService from '../services/UserService'; // Import UserService module
import AdminNavbar from '../Admin/AdminNavbar'

const UserDetails = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false); // Flag for enabling edit mode
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    password: '',
  });

  useEffect(() => {
    // Fetch logged-in user from localStorage
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
          // Ensure token is set before fetching user details
          UserService.setToken(loggedInUser.token);
          const fetchedUser = await UserService.getById(loggedInUser.id); // Using UserService to fetch user details
          setUser(fetchedUser);
          setLoading(false);
          // Initialize form data with fetched user details
          setFormData({
            firstName: fetchedUser.firstName || '',
            lastName: fetchedUser.lastName || '',
            phoneNumber: fetchedUser.phoneNumber || '',
            password: '', // Password should not be pre-filled for security reasons
          });
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
        setLoading(false);
        // Handle error fetching user details
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

  const handleEditSave = async () => {
    try {
      if (loggedInUser) {
        // Ensure token is set before updating user details
        UserService.setToken(loggedInUser.token);
        const updatedUser = await UserService.update(loggedInUser.id, formData); // Using UserService to update user details
        setUser(updatedUser); // Update the user state with updated details
        setEditMode(false);
        // Optionally show success message or update state
      }
    } catch (error) {
      console.error('Error updating user details:', error);
      // Handle error updating user details
    }
  };

  if (loading) {
    return <p>Loading user details...</p>;
  }

  if (!user) {
    return <p>User not found.</p>;
  }

  return (
    <><AdminNavbar /><div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
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
                  {/* Add more fields as needed */}
                  <button
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      onClick={() => setEditMode(true)}
                  >
                      Edit
                  </button>
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
                              className="border rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500" />
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
                              className="border rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </label>
                  </div>
                  <div>
                      <label htmlFor="email" className="block">
                          Email:
                          <input
                              type="text"
                              id="email"
                              name="email"
                              value={user.email} // Display email (assuming it's not editable)
                              readOnly
                              className="border rounded px-3 py-2 mt-1 bg-gray-100" />
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
                              className="border rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </label>
                  </div>
                  <div>
                      <label htmlFor="password" className="block">
                          Password:
                          <input
                              type="password"
                              id="password"
                              name="password"
                              value={formData.password}
                              onChange={handleInputChange}
                              className="border rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </label>
                  </div>
                  {/* Add more fields as needed */}
                  <div className="space-x-4">
                      <button
                          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
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
      </div></>
  );
};

export default UserDetails;
