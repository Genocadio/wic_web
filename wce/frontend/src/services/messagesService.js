// src/services/messagesService.js
import axios from 'axios';

const baseUrl = 'http://localhost:3001/api/messages';

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
  const request = axios.get(baseUrl, getAuthConfig());
  const response = await request;
  return response.data;
};

const create = async (newObject) => {
  const request = axios.post(baseUrl, newObject, getAuthConfig());
  const response = await request;
  return response.data;
};

const update = async (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject, getAuthConfig());
  const response = await request;
  return response.data;
};

const delet = async (id) => {
  const request = axios.delete(`${baseUrl}/${id}`, getAuthConfig());
  const response = await request;
  return response.data;
};

const getById = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/${id}`, getAuthConfig());
    return response.data;
  } catch (error) {
    console.error(`Error fetching message details for ID ${id}:`, error);
    throw new Error('Failed to fetch message details');
  }
};

export default {
  getAll,
  create,
  update,
  delet,
  getById,
  setToken
};
