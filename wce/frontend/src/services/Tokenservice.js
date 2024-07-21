import axios from 'axios';

const BASE_URL =  'http://localhost:3001/api/tokens'; // Adjust URL as per your backend setup

// Function to fetch challenge token
const getChall = async (accessToken) => {
  try {
    const response = await axios.get(`${BASE_URL}/cha`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.challengeToken;
  } catch (error) {
    console.error('Error fetching challenge token:', error);
    throw error;
  }
};

// Function to refresh access token
const getRef = async (accessToken, challengeToken) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/ref`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'X-Challenge-Token': challengeToken,
        },
      }
    );
    return response.data.accessToken;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    throw error;
  }
};

export default { getChall, getRef };
