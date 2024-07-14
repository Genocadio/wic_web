const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service', // Reference to the Service model
    required: true
  },
  serviceName: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    default: 1
  },
  totalPrice: {
    type: Number,
    required: true
  },
  notes: {
    type: String
  },
  status: {
    type: String,
    default: 'place' // Default status is 'place'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Reference to the User model
  },
  location: {
    type: String
  // Assuming location is required for the order
  },
  orderDate: {
    type: Date,
    default: Date.now // Default to current date/time
  },
  paymentMethod: {
    type: String,
    defaul: 'MOMO'
  },

  // Add other order properties as needed
});

orderSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
