import React, { useState, useEffect } from 'react';
import getServices from './services/getServices';
import { Link } from 'react-router-dom';
import Navbar from './User/Navbar';
import 'daisyui/dist/full.css'; // Import DaisyUI full CSS

const Home = () => {
  const [services, setServices] = useState([]);
  const [activeType, setActiveType] = useState(null);

  useEffect(() => {
    // Fetch services on component mount
    getServices.getAll()
      .then(response => {
        setServices(response);
      })
      .catch(error => console.error('Error fetching services:', error));
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

      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        {/* Hero Section */}
        <div className="container mx-auto px-4 md:px-6 py-6 md:py-12 lg:py-16">
          <div className="hero bg-base-200">
            <div className="hero-content text-center">
              <div className="max-w-md">
                <h1 className="text-5xl font-bold mb-4">Hello there</h1>
                <p className="py-4 text-lg text-gray-700">
                  Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
                  quasi. In deleniti eaque aut repudiandae et a id nisi.
                </p>
              </div>
            </div>
          </div>

          {/* Service Type Buttons */}
          <div className="flex flex-wrap justify-center space-x-4 mt-6">
            {serviceTypes.map(type => (
              <div key={type} className="relative group m-2">
                <button
                  className={`btn btn-wide btn-primary ${activeType === type ? 'active' : ''}`}
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
      </div>
    </>
  );
};

export default Home;
