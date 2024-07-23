import axios from 'axios';

const baseUrl = '/api'; // Base URL for API

const login = async (credentials) => {
  try {
    const response = await axios.post(`${baseUrl}/login`, credentials);
    return response.data;
  } catch (error) {
    // Handle error (e.g., display error message, log error)
    throw error; // Propagate the error to the caller
  }
};

const register = async (userData) => {
  try {
    const response = await axios.post(`${baseUrl}/users`, userData);
    return response.data;
  } catch (error) {
    // Handle error (e.g., display error message, log error)
    throw error; // Propagate the error to the caller
  }
};

export default {
  login,
  register,
};