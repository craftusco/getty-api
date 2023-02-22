// getty.js
const axios = require('axios');
const { getBearerToken } = require('./auth.getty');
const credentials = require('../config/getty');

const GETTY_API_URL = 'https://api.gettyimages.com/v3';

const instance = async (req)  => {
  if (!req.session) {
    throw new Error('Session is not defined');
  }

  const token = req.session.token;
  if (!token) {
    throw new Error('Access token is not defined');
  }

  return axios.create({
    baseURL: GETTY_API_URL,
    headers: {
      'Authorization': `Bearer ${token.accessToken}`,
      'Api-Key': credentials.apiKey
    },
  });
}

/* Get User Details */
const getCurrentUser = async (req) => {
  const axiosInstance = await instance(req);
  try {
    const response = await axiosInstance.get('/customers/current');
    return response.data;
  } catch (error) {
    console.error('Error retrieving user details:', error.message);
    return null;
  }
};

/* Get Latest Downloads */
const getGettyImagesData = async (req, dateFrom, dateTo) => {
  const axiosInstance = await instance(req);
  const params = {
    date_from: dateFrom,
    date_to: dateTo
  }
  try {
    const response = await axiosInstance.get('/downloads', { params });
    return response.data;
  } catch (error) {
    console.error('Error retrieving Getty Images data:', error.message);
    return null;
  }
};

module.exports = { getCurrentUser, getGettyImagesData };