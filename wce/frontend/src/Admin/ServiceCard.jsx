// src/components/ServiceCard.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from React Router

const ServiceCard = ({ service, onDelete }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = () => {
    setConfirmDelete(true);
  };

  const handleConfirmDelete = () => {
    onDelete(service.id);
    setConfirmDelete(false);
  };

  const handleCancelDelete = () => {
    setConfirmDelete(false);
  };

  return (
    <div className="bg-white overflow-hidden shadow-sm rounded-lg w-full">
      {/* Use Link to navigate to service details page */}
      <Link to={`/manage-services/${service.id}`} className="block">
        <div className="px-3 py-2">
          <div className="font-bold text-lg mb-1">{service.Name}</div>
          <p className="text-gray-700 text-sm mb-1">Type: {service.Type}</p>
          <p className="text-gray-700 text-sm mb-1">Price: {service.price}</p>
          <p className="text-gray-700 text-sm mb-1">Sold in Units: {service.soldInUnits ? 'Yes' : 'No'}</p>
        </div>
      </Link>
      <div className="px-3 py-1 flex justify-end items-center">
        <button
          onClick={handleDelete}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded-md text-xs"
        >
          Delete
        </button>
      </div>

      {confirmDelete && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-4 w-64">
            <p className="text-gray-900 text-sm font-medium mb-2">Are you sure you want to delete this service?</p>
            <div className="flex justify-end">
              <button
                onClick={handleConfirmDelete}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded-md text-xs mr-2"
              >
                Yes
              </button>
              <button
                onClick={handleCancelDelete}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-1 px-2 rounded-md text-xs"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceCard;
