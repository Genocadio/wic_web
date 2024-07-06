import React from 'react';
import { Link } from 'react-router-dom';

const ServiceOverlay = ({ services, handleServiceClick }) => {
  return (
    <div className="absolute top-16 right-0 left-0 bg-white border border-gray-200 rounded-md shadow-lg z-20 p-4">
      {services.length > 0 ? (
        <ul className="divide-y divide-gray-200">
          {services.map((service) => (
            <li key={service.id} className="py-2">
              <Link
                to={`/service/${service.id}`}
                className="text-primary hover:text-primary-dark"
                onClick={() => handleServiceClick(service)}
              >
                {service.Name}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">No services found.</p>
      )}
    </div>
  );
};

export default ServiceOverlay;
