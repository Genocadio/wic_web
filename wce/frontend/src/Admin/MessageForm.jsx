import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import messagesService from '../services/messagesService';
import UserService from '../services/UserService';

const MessageForm = ({ onMessageCreated }) => {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [submittedBy, setSubmittedBy] = useState('');
  const [viewedBy, setViewedBy] = useState('');
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser) {
      setSubmittedBy(loggedInUser.id);
      
      const fetchUsers = async () => {
        try {
          UserService.setToken(loggedInUser.token);
          const fetchedUsers = await UserService.getAll();
          setUsers(fetchedUsers);
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      };

      fetchUsers();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newMessage = {
        subject,
        content,
        submittedBy,
        viewedBy,
      };
      const createdMessage = await messagesService.create(newMessage);
      onMessageCreated(createdMessage);
      setSubject('');
      setContent('');
      setViewedBy('');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate('/login');
      } else {
        console.error('Error creating message:', error);
      }
    }
  };

  const filteredUsers = users.filter(user =>
    (user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phoneNumber.includes(searchQuery)) &&
    searchQuery.trim() !== '' // Ensure searchQuery is not empty
  ).slice(0, 3);

  return (
    <form className="p-4 space-y-4 bg-white shadow rounded" onSubmit={handleSubmit}>
      <h2 className="text-lg font-bold">Create Message</h2>
      <div>
        <label className="block text-sm font-medium">Subject</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full input input-bordered"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full textarea textarea-bordered"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Viewed By</label>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full input input-bordered"
        />
        {filteredUsers.length > 0 && (
          <ul className="bg-white border border-gray-200 mt-2 rounded max-h-60 overflow-auto">
            {filteredUsers.map(user => (
              <li
                key={user.id}
                className="p-2 cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  setViewedBy(user.id);
                  setSearchQuery(user.email); // Set searchQuery to user's email when selected
                }}
              >
                {user.firstName} {user.lastName}
              </li>
            ))}
          </ul>
        )}
      </div>
      <button type="submit" className="btn btn-primary">
        Create Message
      </button>
    </form>
  );
};

export default MessageForm;
