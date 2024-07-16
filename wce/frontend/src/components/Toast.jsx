import React, { useState, useEffect } from 'react';

const Toast = ({ message, type }) => {
  const [visibleMessages, setVisibleMessages] = useState([]);

  useEffect(() => {
    if (message && type) {
      setVisibleMessages(prevMessages => [...prevMessages, { message, type }]);
    }
  }, [message, type]);

  useEffect(() => {
    if (visibleMessages.length === 0) return;

    const timer = setTimeout(() => {
      setVisibleMessages(prevMessages => prevMessages.slice(1));
    }, 3000);

    return () => clearTimeout(timer);
  }, [visibleMessages]);

  if (visibleMessages.length === 0) return null;

  return (
    <div className="toast toast-top toast-center">
      {visibleMessages.map((msg, index) => (
        <div key={index} className={`alert ${msg.type === 'error' ? 'alert-error' : 'alert-success'}`}>
          <span>{msg.message}</span>
        </div>
      ))}
    </div>
  );
};

export default Toast;
