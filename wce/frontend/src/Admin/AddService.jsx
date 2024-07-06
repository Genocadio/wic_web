import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import getService from '../services/getServices'; // Adjust import path as per your project structure
import AdminNavbar from './AdminNavbar'

const AddService = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [imageLinks, setImageLinks] = useState('');
  const [videoLinks, setVideoLinks] = useState('');
  const [showImages, setShowImages] = useState(false);
  const [showVideos, setShowVideos] = useState(false);
  const [soldInUnits, setSoldInUnits] = useState(false);
  const [price, setPrice] = useState('');
  const [locationRequired, setLocationRequired] = useState(false);
  const [error, setError] = useState(null);

  const handleAddService = async (e) => {
    e.preventDefault();
    try {
      const newService = {
        Name: name,
        Description: description,
        Type: type,
        ImageLinks: imageLinks.split(',').map(link => link.trim()),
        VideoLinks: videoLinks.split(',').map(link => link.trim()),
        showImages: showImages,
        showVideos: showVideos,
        soldInUnits: soldInUnits,
        price: price,
        locationRequired: locationRequired,
      };

      await getService.create(newService);
      console.log('Service added successfully:', newService);

      // Reset form fields after successful addition
      setName('');
      setDescription('');
      setType('');
      setImageLinks('');
      setVideoLinks('');
      setShowImages(false);
      setShowVideos(false);
      setSoldInUnits(false);
      setPrice('');
      setLocationRequired(false);
      setError(null);

      // Redirect to services list page or dashboard
      navigate('/services');
    } catch (error) {
      setError(error.message || 'Failed to add service');
      console.error('Add service error:', error);
    }
  };

  return (
    <><AdminNavbar /><div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-lg text-center">
        <h1 className="text-2xl font-bold sm:text-3xl">Add New Service</h1>
        {error && <p className="text-red-500">{error}</p>}
      </div>

      <form onSubmit={handleAddService} className="mx-auto mb-0 mt-8 max-w-md space-y-4">
        <div className="grid grid-cols-1 gap-y-4">
          <label htmlFor="name" className="sr-only">Name</label>
          <input
            type="text"
            id="name"
            className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required />

          <label htmlFor="description" className="sr-only">Description</label>
          <textarea
            id="description"
            className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            required
          ></textarea>

          <label htmlFor="type" className="sr-only">Type</label>
          <input
            type="text"
            id="type"
            className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
            placeholder="Type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required />

          <label htmlFor="imageLinks" className="sr-only">Image Links (comma-separated)</label>
          <input
            type="text"
            id="imageLinks"
            className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
            placeholder="Image Links (comma-separated)"
            value={imageLinks}
            onChange={(e) => setImageLinks(e.target.value)} />

          <label htmlFor="videoLinks" className="sr-only">Video Links (comma-separated)</label>
          <input
            type="text"
            id="videoLinks"
            className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
            placeholder="Video Links (comma-separated)"
            value={videoLinks}
            onChange={(e) => setVideoLinks(e.target.value)} />

          <label htmlFor="price" className="sr-only">Price</label>
          <input
            type="number"
            id="price"
            className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)} />

          <div className="flex items-center">
            <label htmlFor="showImages" className="mr-2 text-gray-800">Show Images</label>
            <input
              type="checkbox"
              id="showImages"
              checked={showImages}
              onChange={(e) => setShowImages(e.target.checked)}
              className="rounded border-gray-300 text-blue-500 focus:ring-blue-500 h-4 w-4" />
          </div>

          <div className="flex items-center">
            <label htmlFor="showVideos" className="mr-2 text-gray-800">Show Videos</label>
            <input
              type="checkbox"
              id="showVideos"
              checked={showVideos}
              onChange={(e) => setShowVideos(e.target.checked)}
              className="rounded border-gray-300 text-blue-500 focus:ring-blue-500 h-4 w-4" />
          </div>

          <div className="flex items-center">
            <label htmlFor="soldInUnits" className="mr-2 text-gray-800">Sold in Units</label>
            <input
              type="checkbox"
              id="soldInUnits"
              checked={soldInUnits}
              onChange={(e) => setSoldInUnits(e.target.checked)}
              className="rounded border-gray-300 text-blue-500 focus:ring-blue-500 h-4 w-4" />
          </div>

          <div className="flex items-center">
            <label htmlFor="locationRequired" className="mr-2 text-gray-800">Location Required</label>
            <input
              type="checkbox"
              id="locationRequired"
              checked={locationRequired}
              onChange={(e) => setLocationRequired(e.target.checked)}
              className="rounded border-gray-300 text-blue-500 focus:ring-blue-500 h-4 w-4" />
          </div>
        </div>

        <button
          type="submit"
          className="inline-block rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Add Service
        </button>
      </form>
    </div></>
  );
};

export default AddService;
