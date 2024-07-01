// src/components/ServiceManagement.js
import React, { useEffect, useState } from 'react';
import getServices from '../services/getServices'; // Adjust the path as needed
import ServiceCard from './ServiceCard';
import { Link } from 'react-router-dom'; // Assuming you're using React Router for navigation
import AdminNavbar from './AdminNavbar'

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const data = await getServices.getAll();
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const handleDeleteService = async (serviceId) => {
    try {
      // Show confirmation dialog before deleting
      // Implement deletion logic based on user confirmation
      // For this example, we'll just delete the service directly
      await getServices.delet(serviceId);
      // After deleting, fetch the updated list of services
      fetchServices();
    } catch (error) {
      console.error(`Error deleting service with ID ${serviceId}:`, error);
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredServices = services.filter((service) =>
    service.Name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <><AdminNavbar /><div className="container mx-auto py-8 px-6 lg:px-24">
          <h2 className="text-2xl font-bold mb-4 text-center">Service Management</h2>

          <div className="flex justify-center mb-4">
              <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearch}
                  placeholder="Search by name"
                  className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 mr-2" />
              <Link to="/add-service" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md text-sm">
                  Add Service
              </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredServices.map((service) => (
                  <ServiceCard key={service.id} service={service} onDelete={handleDeleteService} />
              ))}
          </div>
      </div></>
  );
};

export default ServiceManagement;
