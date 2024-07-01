import React, { useState } from 'react';

const EditUserForm = ({ user, onSave, onCancel }) => {
  const [editedUser, setEditedUser] = useState({
    password: user.password || '',
    email: user.email,
    phoneNumber: user.phoneNumber || '',
    location: user.location,
    firstName: user.firstName,
    lastName: user.lastName,
    userType: user.userType,
  });

  const handleChange = (e) => {
    setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedUser);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-2">Edit User</h2>
      {['password', 'email', 'phoneNumber', 'location', 'firstName', 'lastName', 'userType'].map((key) => (
        <label key={key} className="mb-2 block">
          {key.charAt(0).toUpperCase() + key.slice(1)}:
          <input
            type={key === 'password' ? 'password' : 'text'}
            name={key}
            value={editedUser[key]}
            onChange={handleChange}
            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            required={key === 'email'} // Make email required, other fields are optional
          />
        </label>
      ))}
      <div className="flex space-x-4 mt-4">
        <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded">
          Save
        </button>
        <button
          type="button"
          className="bg-gray-500 text-white py-2 px-4 rounded"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditUserForm;
