// src/pages/AdminNoticesPage.js
import React, { useState, useEffect } from 'react';
import NoticeForm from './NoticeForm';
import noticesService from '../services/noticesService';
import AdminNavbar from './AdminNavbar';

const AdminNoticesPage = () => {
  const [allNotices, setAllNotices] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const fetchedNotices = await noticesService.getAll();
        setAllNotices(fetchedNotices);
      } catch (error) {
        console.error('Error fetching notices:', error);
      }
    };

    fetchNotices();
  }, []);

  const handleNoticeCreated = (newNotice) => {
    setAllNotices((prevNotices) => [...prevNotices, newNotice]);
    setShowForm(false); // Hide the form after creating a notice
  };

  const handleDeleteNotice = async (id) => {
    try {
      await noticesService.delet(id);
      setAllNotices((prevNotices) => prevNotices.filter((notice) => notice.id !== id));
    } catch (error) {
      console.error('Error deleting notice:', error);
    }
  };

  return (
    <><AdminNavbar /><div className="p-6 space-y-6 min-h-screen">
      <h1 className="text-2xl font-bold">Manage Notices</h1>
      <button
        onClick={() => setShowForm(!showForm)}
        className="btn btn-primary"
      >
        {showForm ? 'Cancel' : 'Create a New Notice'}
      </button>
      {showForm && <NoticeForm onNoticeCreated={handleNoticeCreated} />}
      <div className="space-y-4">
        <h2 className="text-lg font-bold">Existing Notices</h2>
        <ul className="space-y-2">
          {allNotices.map((notice) => (
            <li key={notice.id} className="p-4 bg-white shadow rounded flex justify-between items-center">
              <div>
                <h3 className="text-md font-semibold">{notice.title}</h3>
                <p>{notice.content}</p>
                <p className="text-sm text-gray-500">
                  {notice.isGlobal ? 'Global Notice' : `Target User: ${notice.targetUser.email}`}
                </p>
              </div>
              <button
                onClick={() => handleDeleteNotice(notice.id)}
                className="btn btn-error ml-4"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div></>
  );
};

export default AdminNoticesPage;
