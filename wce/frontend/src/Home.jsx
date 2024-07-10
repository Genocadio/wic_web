// Home.js
import React, { useState, useEffect } from 'react';
import getServices from './services/getServices';
import { Link } from 'react-router-dom';
import Navbar from './User/Navbar';
import ParticleBackground from './User/ParticlesBackground';

const Home = () => {
  const [services, setServices] = useState([]);
  const [activeType, setActiveType] = useState(null);

  useEffect(() => {
    // Fetch services on component mount
    getServices.getAll()
      .then(response => {
        setServices(response);
      })
      .catch(error => console.log(error));
  }, []);

  // Function to handle click on service type button
  const handleClick = (type) => {
    setActiveType(activeType === type ? null : type);
  };

  // Get unique service types
  const serviceTypes = Array.from(new Set(services.map(service => service.Type)));

  return (
    <>
      <Navbar />

      <div className="relative min-h-screen flex flex-col items-center justify-center py-8 px-4 sm:px-6 lg:px-8 z-10">
        {/* About Section */}
        <div className="max-w-4xl text-center mb-8 bg-opacity-80 bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold mb-4">Welcome to Our Site</h1>
          <p className="text-lg text-gray-700">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus maximus dui a libero consequat, sed tincidunt dolor sagittis.</p>
        </div>

        {/* Service Type Buttons */}
        <div className="flex flex-wrap justify-center space-x-4 mb-8">
          {serviceTypes.map(type => (
            <div key={type} className="relative group m-2">
              <button
                className="bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
                onClick={() => handleClick(type)}
                onMouseEnter={() => handleClick(type)}
              >
                {type}
              </button>
              {activeType === type && (
                <div className="absolute left-0 right-0 bg-white rounded-lg shadow-md overflow-hidden opacity-100 mt-2 p-4 z-10">
                  {services.filter(service => service.Type === type).map(filteredService => (
                    <Link key={filteredService.id} to={`/service/${filteredService.id}`}>
                      <div className="mb-2">
                        <h3 className="font-semibold text-lg">{filteredService.Name}</h3>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
  