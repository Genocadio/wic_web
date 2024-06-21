import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import getServices from './services/getServices'; // Assuming this function exists
import VideoOrYouTubePlayer from './components/youtubevideo'; // Adjust the import path as per your file structure

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
    <div>
      {service ? (
        <div>
          <Link to="/admin">Admin</Link>
          <h1>{service.Name}</h1>
          <p>{service.Description}</p>
          <p>Price {service.price} Frw</p>

          {showImages && service.ImageLinks.length > 0 && (
            <div>
              <h2>Images:</h2>
              {service.ImageLinks.map((link, index) => (
                <img key={index} src={link} alt={`Image ${index}`} />
              ))}
            </div>
          )}

          {showVideos && service.VideoLinks.length > 0 && (
            <div>
              <h2>Videos:</h2>
              {service.VideoLinks.map((link, index) => (
                <VideoOrYouTubePlayer key={index} link={link} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
      <button><Link to="/Pay">Place order</Link></button>
    </div>
  );
};

export default ServicePage;
