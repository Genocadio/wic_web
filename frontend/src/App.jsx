import { useState, useEffect } from 'react'
import getServices from './services/getServices'
import Services from './components/Services'
import AddService from './components/AddService'
import Filter from './components/Filter'
import { Link } from 'react-router-dom'

// Component to filter the services

// Main App component
const App = () => {
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

  const addService = (serviceObj) => {
    const existingService = services.find(service => service.Name.toLowerCase() === serviceObj.Name.toLowerCase());

    if (existingService) {
      if (window.confirm(`Service "${existingService.Name}" already exists. Do you want to update its description?`)) {
        const updatedService = { ...existingService, ...serviceObj };

        getServices
          .update(existingService.id, updatedService)
          .then(updatedService => {
            setServices(services.map(service =>
              service.id === updatedService.id ? updatedService : service
            ));
          })
          .catch(error => {
            console.error('Error updating service:', error);
          });
      }
    } else {
      getServices
        .create(serviceObj)
        .then(newService => {
          setServices([...services, newService]);
        })
        .catch(error => {
          console.error('Error adding new service:', error);
        });
    }
  };

  const deleteService = (id) => {
    const service = services.find(service => service.id === id);
    if (window.confirm(`Delete ${service.Name}?`)) {
      getServices.delet(id)
        .then(() => {
          setServices(services.filter(service => service.id !== id));
        })
        .catch(error => {
          console.error('Error deleting service:', error);
        });
    }
  };

  const updateService = (id, updatedService) => {
    return getServices.update(id, updatedService)
      .then(updatedService => {
        setServices(services.map(service =>
          service.id === updatedService.id ? updatedService : service
        ));
        return updatedService;
      })
      .catch(error => {
        console.error('Error updating service:', error);
        throw error;
      });
  };

  const filteredServices = services.filter(service => 
    service.Name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <h2>Service Admin</h2>
      <Link to="/">Home</Link>
      <Filter searchQuery={searchQuery} setSearchQuery={setSearchQuery} />   
      <h3>Add a service</h3>
      <AddService addService={addService} />
      <h2>Services</h2>
      <Services services={filteredServices} deleteService={deleteService} updateService={updateService} />
    </div>
  );
};

export default App;
