import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import getServices from '../services/getServices'; // Adjust the import path as needed
import Navbar from './Navbar';
import 'daisyui/dist/full.css'; // Import DaisyUI full CSS

const fetchServices = async () => {
  const response = await getServices.getAll();
  return response;
};

const ServicesBySubtype = () => {
  const { subtype } = useParams(); // Get the subtype from URL parameters

  const { data: services = [], isLoading, error } = useQuery({
    queryKey: ['services'],
    queryFn: fetchServices,
  });

  // Filter services by subtype
  const filteredServices = services.filter(service => 
    service.Subtype.toLowerCase() === subtype.toLowerCase()
  );

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="container mx-auto px-4 md:px-6 py-6 md:py-12 lg:py-16">
          {/* Error Message */}
          {error && (
            <div className="text-red-500 text-center mb-4">
              Error fetching services: {error.message}
            </div>
          )}

          {/* Loading Spinner */}
          {isLoading ? (
            <div className="text-center">
              <div className="loader"></div> {/* Add your loader CSS class here */}
              <p>Loading services...</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg mx-auto">
              <h1 className="text-3xl font-bold mb-6 text-center">{subtype}</h1>
              <div className="">
                <ul className="list-disc pl-6 space-y-4">
                  {filteredServices.length > 0 ? (
                    filteredServices.map(service => (
                      <li key={service.id}>
                        <Link to={`/service/${service.id}`} className="text-blue-500 hover:underline text-lg">
                          {service.Name}
                        </Link>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-600">No services found for this subtype.</li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ServicesBySubtype;
