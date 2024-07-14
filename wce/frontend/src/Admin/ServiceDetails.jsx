// src/components/ServiceDetails.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import getServices from '../services/getServices'; // Adjust import path as per your project structure
import VideoOrYouTubePlayer from '../components/youtubevideo'; // Adjust import path as per your project structure
import AdminNavbar from './AdminNavbar'

const ServiceDetails = () => {
  const { id } = useParams(); // Fetch service ID from URL params
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [formData, setFormData] = useState({
    Name: '',
    Description: '',
    Type: '',
    ImageLinks: '',
    VideoLinks: '',
    showImages: false,
    showVideos: false,
    soldInUnits: false,
    price: 0,
    locationRequired: false,
  });
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchServiceDetails();
  }, [id]);

  const fetchServiceDetails = async () => {
    try {
      const serviceData = await getServices.getById(id); // Implement getById method in getServices
      setService(serviceData);
      setFormData({
        Name: serviceData?.Name || '',
        Description: serviceData?.Description || '',
        Type: serviceData?.Type || '',
        ImageLinks: serviceData?.ImageLinks?.join(', ') || '',
        VideoLinks: serviceData?.VideoLinks?.join(', ') || '',
        showImages: serviceData?.showImages || false,
        showVideos: serviceData?.showVideos || false,
        soldInUnits: serviceData?.soldInUnits || false,
        price: serviceData?.price || 0,
        locationRequired: serviceData?.locationRequired || false,
      });
    } catch (error) {
      console.error(`Error fetching service details for ID ${id}:`, error);
      setError(error.message || 'Failed to fetch service details');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await getServices.update(id, {
        ...formData,
        ImageLinks: formData.ImageLinks.split(',').map(link => link.trim()),
        VideoLinks: formData.VideoLinks.split(',').map(link => link.trim()),
      });
      await fetchServiceDetails(); // Refresh the service details after update
      setIsEditing(false);
    } catch (error) {
      console.error(`Error updating service with ID ${id}:`, error);
      setError(error.message || 'Failed to update service');
    }
  };

  if (!service) return <p>Loading...</p>;

  return (
    <><AdminNavbar /><div className="flex justify-center  min-h-screen">
      <div className="max-w-xl w-full p-6 bg-white rounded-lg shadow-md mt-16">
        <h2 className="text-2xl font-bold mb-4 text-center">Service Details</h2>
        {error && <p className="text-red-500">{error}</p>}
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="Name"
                  value={formData.Name}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="Description"
                  value={formData.Description}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <input
                  type="text"
                  name="Type"
                  value={formData.Type}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Image Links (comma separated)</label>
                <input
                  type="text"
                  name="ImageLinks"
                  value={formData.ImageLinks}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Video Links (comma separated)</label>
                <input
                  type="text"
                  name="VideoLinks"
                  value={formData.VideoLinks}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
              </div>
              <div className="flex items-center">
                <input
                  id="showImages"
                  name="showImages"
                  type="checkbox"
                  checked={formData.showImages}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-blue-500 focus:ring-blue-500 h-4 w-4" />
                <label htmlFor="showImages" className="ml-2 text-sm text-gray-900">
                  Show Images
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="showVideos"
                  name="showVideos"
                  type="checkbox"
                  checked={formData.showVideos}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-blue-500 focus:ring-blue-500 h-4 w-4" />
                <label htmlFor="showVideos" className="ml-2 text-sm text-gray-900">
                  Show Videos
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="soldInUnits"
                  name="soldInUnits"
                  type="checkbox"
                  checked={formData.soldInUnits}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-blue-500 focus:ring-blue-500 h-4 w-4" />
                <label htmlFor="soldInUnits" className="ml-2 text-sm text-gray-900">
                  Sold in Units
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="locationRequired"
                  name="locationRequired"
                  type="checkbox"
                  checked={formData.locationRequired}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-blue-500 focus:ring-blue-500 h-4 w-4" />
                <label htmlFor="locationRequired" className="ml-2 text-sm text-gray-900">
                  Location Required
                </label>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md"
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <div className="mt-1 text-lg font-bold">{formData.Name}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <div className="mt-1">{formData.Description}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <div className="mt-1">{formData.Type}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Price</label>
              <div className="mt-1">${formData.price}</div>
            </div>
            {formData.ImageLinks && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Image Links</label>
                <div className="mt-1 flex flex-wrap">
                  {formData.ImageLinks.split(',').map((link, index) => (
                    <img
                      key={index}
                      src={link.trim()}
                      alt={`Service Image ${index + 1}`}
                      className="w-20 h-20 object-cover mr-2 mb-2 rounded-lg" />
                  ))}
                </div>
              </div>
            )}
            {formData.VideoLinks && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Video Links</label>
                <div className="mt-1">
                  {formData.VideoLinks.split(',').map((link, index) => (
                    <VideoOrYouTubePlayer key={index} link={link.trim()} />
                  ))}
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700">Sold in Units</label>
              <div className="mt-1">{formData.soldInUnits ? 'Yes' : 'No'}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Location Required</label>
              <div className="mt-1">{formData.locationRequired ? 'Yes' : 'No'}</div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md"
              >
                Edit Service
              </button>
            </div>
          </div>
        )}
      </div>
    </div></>
  );
};

export default ServiceDetails;
