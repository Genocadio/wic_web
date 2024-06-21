import { useState } from "react";

const AddService = ({ addService }) => {
  const [newService, setNewService] = useState({
    Name: '',
    Description: '',
    Type: '',
    ImageLinks: [],
    VideoLinks: [],
    showImages: false,
    showVideos: false,
    price: 0,
    soldInUnits: false
  });

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setNewService({ ...newService, [name]: type === 'checkbox' ? checked : value });
  };

  const handleImageLinkChange = (event) => {
    const imageLink = event.target.value.trim();
    if (imageLink !== '') {
      setNewService({ ...newService, ImageLinks: [...newService.ImageLinks, imageLink] });
    }
  };

  const handleVideoLinkChange = (event) => {
    const videoLink = event.target.value.trim();
    if (videoLink !== '') {
      setNewService({ ...newService, VideoLinks: [...newService.VideoLinks, videoLink] });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    addService(newService);
    setNewService({
      Name: '',
      Description: '',
      Type: '',
      ImageLinks: [],
      VideoLinks: [],
      showImages: false,
      showVideos: false,
      price: 0,
      soldInUnits: false
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="Name">Name</label>
          <input id="Name" type="text" name="Name" value={newService.Name} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="Description">Description</label>
          <input id="Description" type="text" name="Description" value={newService.Description} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="Type">Type</label>
          <input id="Type" type="text" name="Type" value={newService.Type} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="ImageLinks">Image Links (separated by commas)</label>
          <input id="ImageLinks" type="text" onChange={handleImageLinkChange} />
        </div>
        <div>
          <label htmlFor="VideoLinks">Video Links (separated by commas)</label>
          <input id="VideoLinks" type="text" onChange={handleVideoLinkChange} />
        </div>
        <div>
          <label htmlFor="price">Price</label>
          <input id="price" type="number" name="price" value={newService.price} onChange={handleChange} required />
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              name="soldInUnits"
              checked={newService.soldInUnits}
              onChange={handleChange}
            />
            Sold in Units
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              name="showImages"
              checked={newService.showImages}
              onChange={handleChange}
            />
            Show Images
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              name="showVideos"
              checked={newService.showVideos}
              onChange={handleChange}
            />
            Show Videos
          </label>
        </div>
        <div>
          <button type="submit">Add</button>
        </div>
      </form>
    </div>
  );
};

export default AddService;
