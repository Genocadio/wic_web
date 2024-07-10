import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import getServices from './services/getServices'; // Assuming this function exists
import VideoOrYouTubePlayer from './components/youtubevideo'; // Adjust the import path as per your file structure
import Navbar from './User/Navbar'

const ServicePage = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [showImages, setShowImages] = useState(false);
  const [showVideos, setShowVideos] = useState(false);

  useEffect(() => {
    getServices.getById(id)
      .then(response => {
        setService(response);
        setShowImages(response.showImages);
        setShowVideos(response.showVideos);
      })
      .catch(error => {
        console.error('Error fetching service details:', error);
        // Handle error state or display error message
      });
  }, [id]); // Dependency on `id` parameter

  return (
    <><Navbar /><div className="flex flex-col min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-24 lg:py-32">
        {service ? (
          <>
            <h1 className="text-4xl font-bold text-center mb-8">{service.Name}</h1>
            <div className={`flex ${showImages && service.ImageLinks.length > 0 ? 'flex-col md:flex-row items-start' : 'flex-col items-center'} space-y-6 md:space-y-0`}>
              <div className={`md:w-1/2 ${showImages && service.ImageLinks.length > 0 ? '' : 'w-full text-center'}`}>
                <p className="text-lg md:text-xl text-gray-700">{service.Description}</p>
                <p className="text-lg md:text-xl text-gray-700">Price: {service.price} Frw</p>
                <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-md px-8 mt-4">
                  <Link to="/Pay">Place order</Link>
                </button>
              </div>
              {showImages && service.ImageLinks.length > 0 && (
                <div className="md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4 ml-0 md:ml-8">
                  {service.ImageLinks.map((link, index) => (
                    <img
                      key={index}
                      src={link}
                      alt={`Image ${index}`}
                      className="rounded-lg shadow-md object-cover"
                      style={{ aspectRatio: '1 / 1' }} />
                  ))}
                </div>
              )}
            </div>
            {showVideos && service.VideoLinks.length > 0 && (
              <div className="mt-12 space-y-6">
                <h2 className="text-2xl font-semibold mb-4">Videos:</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {service.VideoLinks.map((link, index) => (
                    <VideoOrYouTubePlayer key={index} link={link} />
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-lg">Loading...</p>
        )}
      </div>
    </div></>
  );
};

export default ServicePage;
