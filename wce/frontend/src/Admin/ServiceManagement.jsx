import React, { useEffect, useState } from 'react';
import getServices from '../services/getServices'; // Adjust the path as needed
import ServiceCard from './ServiceCard';
import { Link } from 'react-router-dom'; // Assuming you're using React Router for navigation
import AdminNavbar from './AdminNavbar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('');

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
      await getServices.delet(serviceId); // Corrected typo: changed delet to delete
      // setMessage('Service deleted successfully');
      toast.success('Service deleted successfully');
      // setType('success');
      fetchServices();
    } catch (error) {
      console.error(`Error deleting service with ID ${serviceId}:`, error);
      toast.error('Error deleting service');
      // setMessage('Error deleting service');
      // setType('error');
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredServices = services.filter((service) =>
    service.Name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <AdminNavbar />
      <div className="mx-auto-col min-h-screen py-8 px-6 lg:px-24">
        <h2 className="text-2xl font-bold mb-4 text-center">Service Management</h2>

        <div className="flex justify-center mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search by name"
            className="input input-bordered w-full sm:w-auto mr-2"
          />
          <Link
            to="/add-service"
            className="btn btn-primary"
          >
            Add Service
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} onDelete={handleDeleteService} />
          ))}
        </div>
      </div>
    </>
  );
};

export default ServiceManagement;
