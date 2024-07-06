import React, { useState, useEffect } from 'react';
import getServices from './services/getServices';
import { Link } from 'react-router-dom';
import Navbar from './User/Navbar';

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

  return (
    <><Navbar /><div className="min-h-screen flex flex-col items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      {/* About Section */}
      <div className="max-w-4xl text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Welcome to Our Site</h1>
        <p className="text-lg text-gray-700">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus maximus dui a libero consequat, sed tincidunt dolor sagittis.</p>
      </div>

      {/* Service Type Buttons */}
      <div className="flex space-x-4 mb-8">
        {services.map(service => (
          <div key={service.Type} className="relative group">
            <button
              className="bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
              onClick={() => handleClick(service.Type)}
              onMouseEnter={() => handleClick(service.Type)}
            >
              {service.Type}
            </button>
            {activeType === service.Type && (
              <div className="absolute left-0 right-0 bg-white rounded-lg shadow-md overflow-hidden opacity-100 mt-2 p-4 z-10">
                {services.filter(s => s.Type === service.Type).map(filteredService => (
                  <Link key={filteredService.id} to={`/service/${filteredService.id}`}>
                    <div className="mb-2">
                      <h3 className="font-semibold text-lg">{filteredService.Name}</h3>
                      <p className="text-gray-600">{filteredService.Description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div></>
  );
};

export default Home;
