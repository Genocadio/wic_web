// src/pages/UserMessagesPage.js
import React, { useState, useEffect } from 'react';
import MessageForm from './MessageForm';
import messagesService from '../services/messagesService';
import Navbar from './Navbar'; // Assuming you have a UserNavbar component
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const UserMessagesPage = () => {
  const [allMessages, setAllMessages] = useState([]);
  const [showMessageForm, setShowMessageForm] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!loggedInUser) {
      navigate('/login'); // Navigate to the login page if not logged in
      return;
    }

    const fetchMessages = async () => {
      try {
        const fetchedMessages = await messagesService.getAll();
        const userMessages = fetchedMessages.filter(message => message.viewedBy === loggedInUser.id);
        setAllMessages(userMessages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [navigate]);

  const handleMessageCreated = (newMessage) => {
    setAllMessages((prevMessages) => [...prevMessages, newMessage]);
    setShowMessageForm(false);
  };

  const handleMarkAsRead = async (messageId) => {
    try {
      const updatedMessage = await messagesService.update(messageId, {
        status: 'read'
      });
      setAllMessages(allMessages.map(message =>
        message.id === messageId ? updatedMessage : message
      ));
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-6 space-y-6 min-h-screen">
        <h1 className="text-2xl font-bold">Your Messages</h1>
        <button className="btn btn-primary" onClick={() => setShowMessageForm(!showMessageForm)}>
          {showMessageForm ? 'Cancel' : 'Create New Message'}
        </button>
        {showMessageForm && <MessageForm onMessageCreated={handleMessageCreated} />}
        <div className="space-y-4">
          <h2 className="text-lg font-bold">Existing Messages</h2>
          <ul className="space-y-2">
            {allMessages.map((message) => (
              <li key={message.id} className="p-4 bg-white shadow rounded">
                <h3 className="text-md font-semibold">{message.subject}</h3>
                <p>{message.content}</p>
                <p className="text-sm text-gray-500">
                  Submitted By: {message.submittedBy.firstName}
                </p>
                {!message.status.includes('read') && (
                  <button
                    className="btn btn-primary mr-2"
                    onClick={() => handleMarkAsRead(message.id)}
                  >
                    Mark as Read
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default UserMessagesPage;
