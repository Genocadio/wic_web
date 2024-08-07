const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // Import path module
const middleware = require('./utils/middleware'); // Import middleware object
const serviceRouter = require('./controlers/servicerouter'); // Example router file, adjust as needed
const logger = require('./utils/logger');
const Oderrouter = require('./controlers/oderrouter');
const usersRouter = require('./controlers/userrouter');
const LogiRouter = require('./controlers/Loginrouter');
const Messagerouter = require('./controlers/messageRoutes');
const Noticerouter = require('./controlers/noticeRoutes');
const Tokenrouter = require('./controlers/Tokenrouter')
require('dotenv').config();

console.log(process.env.SECRET);

const app = express();

// Apply built-in middlewares
app.use(cors());
app.use(express.json());

// Apply custom middlewares
app.use(middleware.requestLogger);
// app.use(middleware.tokenExtractor);
// app.use(middleware.userExtractor);

// MongoDB connection string
const urI = 'mongodb://localhost:27017/';
const uri = "mongodb+srv://yvescadio:Cadio0011@wealthinf.ezi4aqz.mongodb.net/?retryWrites=true&w=majority&appName=wealthInf";

mongoose.set('strictQuery', false);

logger.info('connecting to: ', uri);

// Connect to MongoDB
mongoose.connect(uri)
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB: ', error.message);
  });

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, 'dist')));
app.use(middleware.tokenExtractor);
app.use('/api/services', serviceRouter); // Example usage, adjust as needed
app.use('/api/oders', middleware.userExtractor, Oderrouter);
app.use('/api/users', middleware.userExtractor, usersRouter);
app.use('/api/tokens', middleware.userExtractor, Tokenrouter)
app.use('/api/login', LogiRouter);
app.use('/api/messages', middleware.userExtractor, Messagerouter);
app.use('/api/notices', middleware.userExtractor, Noticerouter);

// Handle non-API routes by serving index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Handle unknown endpoints
app.use(middleware.unkownEndpoint);

// Error handling middleware
app.use(middleware.errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
