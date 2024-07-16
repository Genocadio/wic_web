import axios from 'axios'
const baseUrl = '/api/services'


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
  // console.log('Logged in:', window.localStorage.getItem('loggedInUser'));
  const request = axios.get(baseUrl)
  
  const response = await request
  return response.data
}

const create = async newObject => {
  const request = axios.post(baseUrl, newObject)
  const response = await request
  return response.data
}

const update = async (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  const response = await request
  return response.data
}

const delet = async (id) => {
  
  const request = axios.delete(`${baseUrl}/${id}`)
  const response = await request
  return response.data
}

const getById = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/${id}`, getAuthConfig());
    return response.data
  } catch (error) {
    console.error(`Error fetching service details for ID ${id}:`, error);
    throw new Error('Failed to fetch service details');
  }
}
export default {
  getAll, create, update, delet, getById, setToken
}