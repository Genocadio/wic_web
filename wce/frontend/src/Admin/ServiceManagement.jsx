import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import getServices from '../services/getServices'; // Adjust the path as needed
import ServiceCard from './ServiceCard';
import { Link } from 'react-router-dom'; // Assuming you're using React Router for navigation
import AdminNavbar from './AdminNavbar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

const ServiceManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const queryClient = useQueryClient();

  // Fetch services using React Query
  const { data: services, isLoading, isError, error } = useQuery({
    queryKey: ['services'],
    queryFn: getServices.getAll,
    onError: (error) => {
      console.error('Error fetching services:', error);
      toast.error('Error fetching services');
    },
  });

  // Mutation for deleting a service
  const deleteServiceMutation = useMutation({
    mutationFn: (serviceId) => getServices.delet(serviceId),
    onSuccess: () => {
      queryClient.invalidateQueries(['services']);
      toast.success('Service deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting service:', error);
      toast.error('Error deleting service');
    },
  });

  const handleDeleteService = (serviceId) => {
    deleteServiceMutation.mutate(serviceId);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  if (isLoading) return <p>Loading services...</p>;
  if (isError) return <p>Error loading services: {error.message}</p>;

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

        {/* Toast Container */}
        <ToastContainer />
      </div>
    </>
  );
};

export default ServiceManagement;
