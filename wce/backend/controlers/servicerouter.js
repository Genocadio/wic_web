// serviceRouter.js
const express = require('express');
const Service = require('../models/service');
const Servicerouter = express.Router();
const mongoose = require('mongoose');
// Define routes for Service model
Servicerouter.get('/', async (request, response) => {
    const services = await Service.find({});
    response.json(services);
});

Servicerouter.post('/', async (request, response) => {
    const body = request.body;
  
    if (!body.Name) {
      return response.status(400).json({ error: 'Name missing' });
    }
  
    const newService = new Service({
      Name: body.Name,
      Description: body.Description || '',
      Type: body.Type || '',
      Subtype: body.Subtype || '', // Added subtype field
      ImageLinks: body.ImageLinks || [],
      VideoLinks: body.VideoLinks || [],
      showImages: body.showImages || false,
      showVideos: body.showVideos || false,
      soldInUnits: body.soldInUnits || false,
      locationRequired: body.locationRequired || false,
      price: body.price || 0
    });
  
    const savedService = await newService.save();
    response.json(savedService);
});

Servicerouter.get('/:id', async (request, response) => {
    try {
        const service = await Service.findById(request.params.id);
        if (service) {
          response.json(service);
        } else {
          response.status(404).end();
        }
      } catch (error) {
        response.status(400).json({ error: 'malformatted id' });
      }
});

Servicerouter.put('/:id', async (request, response) => {
    const body = request.body;

    const service = {
      Name: body.Name,
      Description: body.Description,
      Type: body.Type,
      Subtype: body.Subtype, // Added subtype field
      ImageLinks: body.ImageLinks,
      VideoLinks: body.VideoLinks,
      showImages: body.showImages,
      showVideos: body.showVideos,
      soldInUnits: body.soldInUnits,
      locationRequired: body.locationRequired,
      price: body.price
    };
  
    try {
      const updatedService = await Service.findByIdAndUpdate(request.params.id, service, { new: true });
      if (updatedService) {
        response.json(updatedService);
      } else {
        response.status(404).json({ error: `Service with id ${request.params.id} not found.` });
      }
    } catch (error) {
      response.status(400).json({ error: 'malformatted id' });
    }
});

Servicerouter.delete('/:id', async (request, response) => {
    try {
        const id = request.params.id;
    
        // Check if ID is a valid MongoDB ObjectID
        if (!mongoose.Types.ObjectId.isValid(id)) {
          return response.status(400).json({ error: 'Invalid ID format' });
        }
    
        // Use findByIdAndDelete instead of findByIdAndRemove
        const deletedService = await Service.findByIdAndDelete(id);
    
        if (deletedService) {
          response.status(204).end();
        } else {
          response.status(404).json({ error: `Service with id ${id} not found.` });
        }
      } catch (error) {
        console.error('Error deleting service:', error);
        response.status(500).json({ error: 'Internal server error' });
      }
});

module.exports = Servicerouter;