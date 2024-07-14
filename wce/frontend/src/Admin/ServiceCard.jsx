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
    <div className="card bg-white text-primary-content w-full">
      {/* Use Link to navigate to service details page */}
      
        <div className="card-body">
        <Link to={`/manage-services/${service.id}`} className="block">
          <h2 className="card-title">{service.Name}</h2>
          <p>Type: {service.Type}</p>
          <p>Price: {service.price}</p>
          <p>Sold in Units: {service.soldInUnits ? 'Yes' : 'No'}</p>
      </Link>

          <div className="card-actions justify-end">
        <button
          onClick={handleDelete}
          className="btn btn-error"
        >
          Delete
        </button>
      </div>
        </div>


      {confirmDelete && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-4 w-64">
            <p className="text-gray-900 text-sm font-medium mb-2">Are you sure you want to delete this service?</p>
            <div className="flex justify-end">
              <button
                onClick={handleConfirmDelete}
                className="btn btn-error mr-2"
              >
                Yes
              </button>
              <button
                onClick={handleCancelDelete}
                className="btn btn-secondary"
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
