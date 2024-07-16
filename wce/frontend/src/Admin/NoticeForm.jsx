// src/components/NoticeForm.js
import React, { useState, useEffect } from 'react';
import noticesService from '../services/noticesService';
import UserService from '../services/UserService';

const NoticeForm = ({ onNoticeCreated }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isGlobal, setIsGlobal] = useState(false);
  const [targetUser, setTargetUser] = useState('');
  const [publishedBy, setPublishedBy] = useState('');
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    const loggedInUser = JSON.parse(window.localStorage.getItem('loggedInUser'));
    if (loggedInUser && loggedInUser.id) {
      setPublishedBy(loggedInUser.id);
    }

    const fetchUsers = async () => {
      try {
        UserService.setToken(loggedInUser.token);
        const users = await UserService.getAll();
        console.log(users)
        setUsers(users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    setFilteredUsers(
      users.filter((user) => user.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery, users]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newNotice = {
        title,
        content,
        isGlobal,
        targetUser: isGlobal ? null : targetUser,
        publishedBy,
      };
      const createdNotice = await noticesService.create(newNotice);
      onNoticeCreated(createdNotice);
      setTitle('');
      setContent('');
      setIsGlobal(false);
      setTargetUser('');
      setSearchQuery('');
    } catch (error) {
      console.error('Error creating notice:', error);
    }
  };

  return (
    <form className="p-4 space-y-4 bg-white shadow rounded" onSubmit={handleSubmit}>
      <h2 className="text-lg font-bold">Create Notice</h2>
      <div>
        <label className="block text-sm font-medium">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={isGlobal}
            onChange={() => setIsGlobal(!isGlobal)}
            className="checkbox"
          />
          <span>Is Global</span>
        </label>
      </div>
      {!isGlobal && (
        <div>
          <label className="block text-sm font-medium">Target User</label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by email"
            className="w-full input input-bordered"
          />
          {searchQuery && (
            <ul className="mt-2 space-y-2">
              {filteredUsers.map((user) => (
                <li
                  key={user.id}
                  className="cursor-pointer p-2 bg-gray-100 rounded hover:bg-gray-200"
                  onClick={() => {
                    setTargetUser(user.id);
                    setSearchQuery(user.email);
                  }}
                >
                  {user.email}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      <button type="submit" className="btn btn-primary">
        Create Notice
      </button>
    </form>
  );
};

export default NoticeForm;
