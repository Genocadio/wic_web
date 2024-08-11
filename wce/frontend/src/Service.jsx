import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import getServices from './services/getServices'; // Adjust the import path as needed
import VideoOrYouTubePlayer from './components/youtubevideo'; // Adjust the import path as needed
import Navbar from './User/Navbar';
import 'daisyui'; // Make sure DaisyUI is installed and imported
import { intializeServices } from './redux/servicesSlice'; // Adjust the import path as needed

const ServicePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const services = useSelector((state) => state.services);
  const [showImages, setShowImages] = useState(false);
  const [showVideos, setShowVideos] = useState(false);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser && loggedInUser.token) {
      getServices.setToken(loggedInUser.token);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    // Initialize or fetch services if needed
    dispatch(intializeServices());
  }, [dispatch]);

  const serviceFromRedux = services.find(service => service.id === id);

  useEffect(() => {
    if (serviceFromRedux) {
      setShowImages(serviceFromRedux.showImages);
      setShowVideos(serviceFromRedux.showVideos);
    }
  }, [serviceFromRedux]);

  const handlePlaceOrder = () => {
    navigate(`/pay/${id}`);
  };

  if (!serviceFromRedux) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-52 flex flex-col gap-4">
          <div className="skeleton h-4 w-full bg-gray-200 animate-pulse rounded"></div>
          <div className="skeleton h-4 w-full bg-gray-200 animate-pulse rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen bg-base-200">
        <div className="container mx-auto px-4 md:px-6 py-6 md:py-12 lg:py-16">
          <div className="flex rounded-box flex-col md:flex-row bg-base-100 shadow-xl p-4 space-y-4 md:space-y-0 md:space-x-4">
            <div className={`flex flex-col ${showImages && serviceFromRedux.ImageLinks.length > 0 ? 'md:w-1/2' : 'md:w-full'}`}>
              <div className="rounded-box hero bg-base-200 h-full">
                <div className="hero-content text-center">
                  <div className="max-w-md">
                    <h1 className="text-4xl font-bold">{serviceFromRedux.Name}</h1>
                    <p className="py-4 text-sm md:text-base lg:text-lg">
                      {serviceFromRedux.Description}
                    </p>
                    <button className="btn btn-primary" onClick={handlePlaceOrder}>Place Order</button>
                  </div>
                </div>
              </div>
            </div>
            {showImages && serviceFromRedux.ImageLinks.length > 0 && (
              <div className="flex rounded-box grid card bg-base-200 flex-col md:w-1/2">
                <div className="carousel w-full">
                  {serviceFromRedux.ImageLinks.map((link, index) => (
                    <div key={index} id={`slide${index + 1}`} className="carousel-item relative w-full">
                      <img src={link} alt={`Service ${index + 1}`} className="w-full" />
                      <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                        <a href={`#slide${(index === 0 ? serviceFromRedux.ImageLinks.length : index)}`} className="btn btn-circle">❮</a>
                        <a href={`#slide${(index === serviceFromRedux.ImageLinks.length - 1 ? 1 : index + 2)}`} className="btn btn-circle">❯</a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          {showVideos && serviceFromRedux.VideoLinks.length > 0 && (
            <div className="flex flex-col rounded-box md:flex-row bg-base-100 shadow-xl rounded-lg p-4 space-y-4 md:space-y-0 md:space-x-4 mt-6">
              {serviceFromRedux.VideoLinks.map((link, index) => (
                <div key={index} className="flex flex-col md:w-1/2">
                  <div className="flex-shrink-0 w-full h-64 md:h-48 lg:h-80 rounded-lg overflow-hidden relative border border-gray-200 shadow-md">
                    <VideoOrYouTubePlayer link={link} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ServicePage;
