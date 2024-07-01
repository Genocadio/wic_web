const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  Description: String,
  Type: String,
  ImageLinks: [String],
  VideoLinks: [String],
  showImages: { type: Boolean, default: false },
  showVideos: { type: Boolean, default: false },
  soldInUnits: { type: Boolean, default: false },
  price: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  locationRequired: { type: Boolean, default: false }
});

serviceSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
