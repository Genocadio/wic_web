// src/services/orderServices.js
import axios from 'axios';

const baseUrl = '/api/oders';

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAuthConfig = () => ({
  headers: {
    Authorization: token
  }
});

const getAll = async () => {
  try {
    const response = await axios.get(baseUrl, getAuthConfig());
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

const create = async (newObject) => {
  try {
    const response = await axios.post(baseUrl, newObject, getAuthConfig());
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

const update = async (id, newObject) => {
  try {
    const response = await axios.put(`${baseUrl}/${id}`, newObject, getAuthConfig());
    return response.data;
  } catch (error) {
    console.error(`Error updating order with ID ${id}:`, error);
    throw error;
  }
};

const remove = async (id) => {
  try {
    const response = await axios.delete(`${baseUrl}/${id}`, getAuthConfig());
    return response.data;
  } catch (error) {
    console.error(`Error deleting order with ID ${id}:`, error);
    throw error;
  }
};

const getById = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/${id}`, getAuthConfig());
    return response.data;
  } catch (error) {
    console.error(`Error fetching order details for ID ${id}:`, error);
    throw error;
  }
};

export default {
  getAll,
  create,
  update,
  remove,
  getById,
  setToken
};
