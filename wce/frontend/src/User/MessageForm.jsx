// src/components/MessageForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import messagesService from '../services/messagesService';
import { toast } from'react-toastify';

const MessageForm = ({ onMessageCreated }) => {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [submittedBy, setSubmittedBy] = useState('');
  const [viewedBy, setViewedBy] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser) {
      setSubmittedBy(loggedInUser.id);
      setViewedBy(loggedInUser.id); // Automatically set the user as the viewer
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newMessage = {
        subject,
        content,
        submittedBy,
      };
      const createdMessage = await messagesService.create(newMessage);
      toast.success('Message sent')
      onMessageCreated(createdMessage);
      setSubject('');
      setContent('');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate('/login');
      } else {
        console.error('Error creating message:', error);
      }
    }
  };

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
      <button type="submit" className="btn btn-primary">
        Create Message
      </button>
    </form>
  );
};

export default MessageForm;
