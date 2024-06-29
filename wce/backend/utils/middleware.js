
const logger = require('./logger')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/User')
require('dotenv').config();
const SECRET = process.env.SECRET


const requestLogger = (request, response, next) => {
    logger.info('Method: ', request.method)
    logger.info('path: ', request.path)
    logger.info('body: ', request.body)
    logger.info('.........')
    next()
}

const unkownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unkown endpoint' })
}

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
    } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error collection')) {
      return response.status(400).json({ error: 'username must be unique' })
    } else if (error.name ===  'JsonWebTokenError') {
      return response.status(401).json({ error: 'token invalid' })
      next(error)
    }
  }
  const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization');
    console.log('authorization: ', authorization)
    if (authorization && authorization !== 'undefined' && authorization.startsWith('Bearer ')) {
        request.token = authorization.replace('Bearer ', '');
    } else {
        request.token = null; // Ensure request.token is set, even if not present
    }
    next();
};

const userExtractor = async (request, response, next) => {
    const token = request.token;

    if (!token) {
        request.user = null;
        return next(); // No token, move to the next middleware
    }

    try {
        const decodedToken = jwt.verify(token, SECRET);
        if (!decodedToken.id) {
          throw new Error('Token invalid');
      }
      const user = await User.findById(decodedToken.id);
      if (!user) {
          throw new Error('User not found');
      }
      request.user = user; // Attach user object to request
      // console.log('user fetched from userExtractor: ')
      next();
    } catch (error) {
        console.error('Error in user extractor:', error.message);
        return response.status(401).json({ error: 'Unauthorized' });
    }
};
  module.exports = {
    requestLogger,
    unkownEndpoint,
    errorHandler,
    tokenExtractor,
    userExtractor
  }