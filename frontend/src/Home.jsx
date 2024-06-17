import React, { useState, useEffect } from 'react';
import getServices from './services/getServices';
import Filter from './components/Filter';
import { Link } from 'react-router-dom';

const Home = () => {
  const [services, setServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getServices
      .getAll()
      .then(response => {
        setServices(response);
      })
      .catch(error => console.log(error));
  }, []);

  // Function to group services by type
  const groupServicesByType = () => {
    return services.reduce((acc, service) => {
      const { Type } = service;
      if (!acc[Type]) {
        acc[Type] = [];
      }
      acc[Type].push(service);
      return acc;
    }, {});
  };

  // Function to filter services by search query
  const filteredServices = Object.keys(groupServicesByType()).reduce((acc, type) => {
    const filteredTypeServices = groupServicesByType()[type].filter(service =>
      service.Name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (filteredTypeServices.length > 0) {
      acc[type] = filteredTypeServices;
    }
    return acc;
  }, {});

  return (
    <div>
      <h1>Home</h1>
      <Link to="/admin">Admin</Link>
      <Filter searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <h2>Services</h2>
      {Object.keys(filteredServices).length > 0 ? (
        Object.keys(filteredServices).map((type) => (
          <div key={type}>
            <h3>{type}</h3>
            <ul>
              {filteredServices[type].map((service) => (
                <li key={service.id}>
                  <Link to={`/service/${service.id}`}>
                    <h4>{service.Name}</h4>
                  </Link>
                  {/* Render images and videos here if needed */}
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p>No services found matching your search criteria.</p>
      )}
    </div>
  );
};

export default Home;
