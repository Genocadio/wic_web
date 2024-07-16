const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  phoneNumber: String,
  location: String,
  userType: {
    type: String,
    enum: ['customer', 'admin'], // Adjust based on your application roles
    default: 'customer'
  },
  passwordHash: {
    type: String,
    required: true
  },
  hasNotification: {
    type: Boolean,
    default: false
  },
  hasNotice: {
    type: Boolean,
    default: false
  },
  orders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }],
  notices: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Notice'
  }],
  messages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  }],
  dateOfCreation: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
});

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash; // Do not reveal password hash
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
