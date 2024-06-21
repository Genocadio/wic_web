import { useState } from "react";
import VideoOrYouTubePlayer from "./youtubevideo";


const ServiceDisplay = ({ service, handleEdit, toggleShowImages, toggleShowVideos, deleteService }) => {
  const { Name, Description, Type, ImageLinks, VideoLinks, showImages, showVideos, price, soldInUnits } = service;

  return (
    <li>
      <span onClick={handleEdit}>{Name}</span>: {Description}
      <p>Type: {Type}</p>
      <p>Price: {price}</p>
      <p>Sold in Units: {soldInUnits ? 'Yes' : 'No'}</p>
      <div>
        {showImages && ImageLinks && ImageLinks.length > 0 && (
          <div>
            {ImageLinks.map((link, idx) => (
              <img key={idx} src={link.trim()} alt={`Service Image ${idx}`} style={{ maxWidth: '100px', maxHeight: '100px', margin: '5px' }} />
            ))}
          </div>
        )}
        {showVideos && VideoLinks && VideoLinks.length > 0 && (
          <div>
            {VideoLinks.map((link, idx) => (
              <VideoOrYouTubePlayer key={idx} link={link} />
            ))}
          </div>
        )}
      </div>
      <div>
        <button onClick={() => toggleShowImages(service)}>
          {showImages ? 'Hide Images' : 'Show Images'}
        </button>
        <button onClick={() => toggleShowVideos(service)}>
          {showVideos ? 'Hide Videos' : 'Show Videos'}
        </button>
        <button onClick={() => deleteService(service.id)}>Delete</button>
      </div>
    </li>
  );
};

const ServiceEditForm = ({ editedService, setEditedService, handleSaveEdit, handleCancelEdit }) => {
  return (
    <li>
      <input
        type="text"
        value={editedService.Name}
        onChange={(e) => setEditedService({ ...editedService, Name: e.target.value })}
        required
      />
      <input
        type="text"
        value={editedService.Description}
        onChange={(e) => setEditedService({ ...editedService, Description: e.target.value })}
        required
      />
      <input
        type="text"
        value={editedService.Type}
        onChange={(e) => setEditedService({ ...editedService, Type: e.target.value })}
        required
      />
      <div>
        <label htmlFor="editedImageLinks">Image Links (separated by commas)</label>
        <input
          id="editedImageLinks"
          type="text"
          value={editedService.ImageLinks.join(',')}
          onChange={(e) => setEditedService({ ...editedService, ImageLinks: e.target.value.split(',') })}
        />
        {editedService.ImageLinks &&
          editedService.ImageLinks.map((link, idx) => (
            <img key={idx} src={link.trim()} alt={`Service Image ${idx}`} style={{ maxWidth: '100px', maxHeight: '100px', margin: '5px' }} />
          ))}
      </div>
      <div>
        <label htmlFor="editedVideoLinks">Video Links (separated by commas)</label>
        <input
          id="editedVideoLinks"
          type="text"
          value={editedService.VideoLinks.join(',')}
          onChange={(e) => setEditedService({ ...editedService, VideoLinks: e.target.value.split(',') })}
        />
        {editedService.VideoLinks &&
          editedService.VideoLinks.map((link, idx) => (
            <VideoOrYouTubePlayer key={idx} link={link} />
          ))}
      </div>
      <div>
        <label htmlFor="editedPrice">Price</label>
        <input
          id="editedPrice"
          type="number"
          value={editedService.price}
          onChange={(e) => setEditedService({ ...editedService, price: parseFloat(e.target.value) })}
          required
        />
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            name="soldInUnits"
            checked={editedService.soldInUnits}
            onChange={(e) => setEditedService({ ...editedService, soldInUnits: e.target.checked })}
          />
          Sold in Units
        </label>
      </div>
      <button onClick={handleSaveEdit}>Save</button>
      <button onClick={handleCancelEdit}>Cancel</button>
    </li>
  );
};
  
const Services = ({ services, deleteService, updateService }) => {
  const [editMode, setEditMode] = useState(null);
  const [editedService, setEditedService] = useState({
    id: null,
    Name: '',
    Description: '',
    Type: '',
    ImageLinks: [],
    VideoLinks: [],
    showImages: false,
    showVideos: false
  });

  const handleEdit = (index, service) => {
    setEditMode(index);
    setEditedService(service);
  };

  const handleCancelEdit = () => {
    setEditMode(null);
    setEditedService({
      id: null,
      Name: '',
      Description: '',
      Type: '',
      ImageLinks: [],
      VideoLinks: [],
      showImages: false,
      showVideos: false
    });
  };

  const handleSaveEdit = () => {
    updateService(editedService.id, editedService)
      .then(() => {
        setEditMode(null);
        setEditedService({
          id: null,
          Name: '',
          Description: '',
          Type: '',
          ImageLinks: [],
          VideoLinks: [],
          showImages: false,
          showVideos: false
        });
      })
      .catch(error => {
        console.error('Error updating service:', error);
        alert('Failed to update service. Please try again.');
      });
  };

  const toggleShowImages = (service) => {
    const updatedService = { ...service, showImages: !service.showImages };
    updateService(service.id, updatedService)
      .catch(error => {
        console.error('Error toggling show images:', error);
        alert('Failed to toggle images. Please try again.');
      });
  };

  const toggleShowVideos = (service) => {
    const updatedService = { ...service, showVideos: !service.showVideos };
    updateService(service.id, updatedService)
      .catch(error => {
        console.error('Error toggling show videos:', error);
        alert('Failed to toggle videos. Please try again.');
      });
  };

  return (
    <ul>
      {services.map((service, index) => (
        editMode === index ? (
          <ServiceEditForm
            key={index}
            editedService={editedService}
            setEditedService={setEditedService}
            handleSaveEdit={handleSaveEdit}
            handleCancelEdit={handleCancelEdit}
          />
        ) : (
          <ServiceDisplay
            key={index}
            service={service}
            handleEdit={() => handleEdit(index, service)}
            toggleShowImages={toggleShowImages}
            toggleShowVideos={toggleShowVideos}
            deleteService={deleteService}
          />
        )
      ))}
    </ul>
  );
};
export default Services  