import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from React Router

const ServiceCard = ({ service, onDelete }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); // New state to handle deleting

  const handleDelete = () => {
    setConfirmDelete(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true); // Set deleting state to true
    try {
      await onDelete(service.id); // Assume onDelete returns a promise
      setConfirmDelete(false);
    } catch (error) {
      console.error('Error deleting service:', error);
      // Optionally, you can set an error message in the state to display it to the user
    } finally {
      setIsDeleting(false); // Reset deleting state
    }
  };

  const handleCancelDelete = () => {
    setConfirmDelete(false);
  };

  return (
    <div className="card shadow-xl bg-base-200 text-primary-content w-full">
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
            disabled={isDeleting} // Disable button when deleting
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
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
                disabled={isDeleting} // Disable button when deleting
              >
                {isDeleting ? 'Deleting...' : 'Yes'}
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
