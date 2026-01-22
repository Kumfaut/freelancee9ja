import axios from 'axios';

const API_KEY = process.env.REACT_APP_IGBO_API_KEY;
const BASE_URL = 'https://igboapi.com/api/v1';

export const searchIgboWord = async (word) => {
  try {
    const response = await axios.get(`${BASE_URL}/words`, {
      params: { keyword: word },
      headers: { 'X-API-Key': API_KEY }
    });
    // The API returns an array of word objects
    return response.data; 
  } catch (error) {
    console.error("IgboAPI Error:", error);
    return null;
  }
};