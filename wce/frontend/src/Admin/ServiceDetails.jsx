import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import getServices from '../services/getServices';
import VideoOrYouTubePlayer from '../components/youtubevideo';
import AdminNavbar from './AdminNavbar';

// Subcomponents and functions
const FormInput = ({ label, name, value, onChange, type = 'text', required = false }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
      required={required}
    />
  </div>
);

const FormTextarea = ({ label, name, value, onChange, required = false }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
      required={required}
    />
  </div>
);

const FormCheckbox = ({ label, name, checked, onChange }) => (
  <div className="flex items-center">
    <input
      id={name}
      name={name}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="rounded border-gray-300 text-blue-500 focus:ring-blue-500 h-4 w-4"
    />
    <label htmlFor={name} className="ml-2 block text-sm text-gray-900">{label}</label>
  </div>
);

const ServiceDetails = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [formData, setFormData] = useState({
    Name: '',
    Description: '',
    Type: '',
    Subtype: '',
    ImageLinks: '',
    VideoLinks: '',
    showImages: false,
    showVideos: false,
    soldInUnits: false,
    price: 0,
    locationRequired: false,
    colors: [],
    sizes: [],
  });
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchServiceDetails();
  }, [id]);

  const fetchServiceDetails = async () => {
    try {
      const serviceData = await getServices.getById(id);
      setService(serviceData);
      setFormData({
        Name: serviceData?.Name || '',
        Description: serviceData?.Description || '',
        Type: serviceData?.Type || '',
        Subtype: serviceData?.Subtype || '',
        ImageLinks: serviceData?.ImageLinks?.join(', ') || '',
        VideoLinks: serviceData?.VideoLinks?.join(', ') || '',
        showImages: serviceData?.showImages || false,
        showVideos: serviceData?.showVideos || false,
        soldInUnits: serviceData?.soldInUnits || false,
        price: serviceData?.price || 0,
        locationRequired: serviceData?.locationRequired || false,
        colors: serviceData?.colors || [],
        sizes: serviceData?.sizes || [],
      });
    } catch (error) {
      setError(error.message || 'Failed to fetch service details');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'colors' || name === 'sizes') {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value.split(',').map(v => v.trim()),
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await getServices.update(id, {
        ...formData,
        ImageLinks: formData.ImageLinks.split(',').map(link => link.trim()),
        VideoLinks: formData.VideoLinks.split(',').map(link => link.trim()),
        colors: formData.colors,
        sizes: formData.sizes,
      });
      await fetchServiceDetails();
      setIsEditing(false);
    } catch (error) {
      setError(error.message || 'Failed to update service');
    }
  };

  if (!service) return (
    <>
      <AdminNavbar />
      <div className="container mx-auto py-4 px-2 min-h-screen sm:px-6 lg:px-24">
        <div className="overflow-x-auto lg:mx-6">
          <table className="min-w-full bg-white rounded-lg overflow-hidden shadow">
            <tbody>
              {Array.from({ length: 5 }).map((_, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                  <td className="py-2 px-4"><div className="skeleton h-4 w-full"></div></td>
                  <td className="py-2 px-4"><div className="skeleton h-4 w-full"></div></td>
                  <td className="py-2 px-4"><div className="skeleton h-4 w-full"></div></td>
                  <td className="py-2 px-4"><div className="skeleton h-4 w-full"></div></td>
                  <td className="py-2 px-4"><div className="skeleton h-4 w-full"></div></td>
                  <td className="py-2 px-4">
                    <div className="skeleton h-4 w-1/2"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  return (
    <>
      <AdminNavbar />
      <div className="flex justify-center min-h-screen">
        <div className="max-w-xl w-full p-6 bg-white rounded-lg shadow-md mt-16">
          <h2 className="text-2xl font-bold mb-4 text-center">Service Details</h2>
          {error && <p className="text-red-500">{error}</p>}
          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4">
                <FormInput label="Name" name="Name" value={formData.Name} onChange={handleChange} required />
                <FormTextarea label="Description" name="Description" value={formData.Description} onChange={handleChange} required />
                <FormInput label="Type" name="Type" value={formData.Type} onChange={handleChange} required />
                <FormInput label="Subtype" name="Subtype" value={formData.Subtype} onChange={handleChange} />
                <FormInput label="Price" name="price" value={formData.price} onChange={handleChange} type="number" required />
                <FormInput label="Image Links (comma separated)" name="ImageLinks" value={formData.ImageLinks} onChange={handleChange} />
                <FormInput label="Video Links (comma separated)" name="VideoLinks" value={formData.VideoLinks} onChange={handleChange} />
                <FormInput label="Colors (comma separated)" name="colors" value={formData.colors.join(', ')} onChange={handleChange} />
                <FormInput label="Sizes (comma separated)" name="sizes" value={formData.sizes.join(', ')} onChange={handleChange} />
                <FormCheckbox label="Show Images" name="showImages" checked={formData.showImages} onChange={handleChange} />
                <FormCheckbox label="Show Videos" name="showVideos" checked={formData.showVideos} onChange={handleChange} />
                <FormCheckbox label="Sold In Units" name="soldInUnits" checked={formData.soldInUnits} onChange={handleChange} />
                <FormCheckbox label="Location Required" name="locationRequired" checked={formData.locationRequired} onChange={handleChange} />
                <div className="mt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-gray-300 rounded-md text-gray-800">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md">
                    Save
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div>
              <div className="mb-4"><strong>Name:</strong> {formData.Name}</div>
              <div className="mb-4"><strong>Description:</strong> {formData.Description}</div>
              <div className="mb-4"><strong>Type:</strong> {formData.Type}</div>
              <div className="mb-4"><strong>Subtype:</strong> {formData.Subtype}</div>
              <div className="mb-4"><strong>Price:</strong> ${formData.price}</div>
              <div className="mb-4"><strong>Image Links:</strong> {formData.ImageLinks}</div>
              <div className="mb-4"><strong>Video Links:</strong> {formData.VideoLinks}</div>
              <div className="mb-4"><strong>Colors:</strong> {formData.colors.join(', ')}</div>
              <div className="mb-4"><strong>Sizes:</strong> {formData.sizes.join(', ')}</div>
              <div className="mb-4"><strong>Show Images:</strong> {formData.showImages ? 'Yes' : 'No'}</div>
              <div className="mb-4"><strong>Show Videos:</strong> {formData.showVideos ? 'Yes' : 'No'}</div>
              <div className="mb-4"><strong>Sold In Units:</strong> {formData.soldInUnits ? 'Yes' : 'No'}</div>
              <div className="mb-4"><strong>Location Required:</strong> {formData.locationRequired ? 'Yes' : 'No'}</div>
              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md">
                  Edit
                </button>
              </div>
            </div>
          )}
          {formData.VideoLinks && formData.VideoLinks.split(',').map((link, index) => (
            <div key={index} className="mt-4">
              <VideoOrYouTubePlayer url={link.trim()} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ServiceDetails;
