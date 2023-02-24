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

/* Get Count Images and save to DB */
const getCountImages = async (req) => {
  const axiosInstance = await instance(req);
  try {
    const response = await axiosInstance.get('/downloads');
    return response.data.result_count;
  } catch (error) {
    console.error('Error retrieving data:', error.message);
    return null;
  }
};

/* Get User Downloads */
const getGettyImagesData = async (req, dateFrom, dateTo) => {
  const axiosInstance = await instance(req);
  const pageSize = 30;
  let pageNumber = 1;
  let totalData = [];
  
  while (true) {
    const params = {
      date_from: dateFrom,
      date_to: dateTo,
      page_size: pageSize,
      page_number: pageNumber
    };
    
    try {
      const response = await axiosInstance.get('/downloads', { params });
      const data = response.data.downloads;
      
      // If there's no data in the response, break out of the loop
      if (data.length === 0) {
        break;
      }
      
      totalData = totalData.concat(data);
      pageNumber++;
    } catch (error) {
      console.error('Error retrieving Getty Images data:', error.message);
      return null;
    }
  }
  
  // Create an array of promises for each image download request
  const downloadPromises = totalData.map(item => {
    const imageId = item.id;
    const downloadUrl = `${GETTY_API_URL}/downloads/images/${imageId}?auto_download=false&use_team_credits=false`;
    return axiosInstance.post(downloadUrl);
  });

  // Execute all image download requests together
  const downloadResponses = await axios.all(downloadPromises);

  // Get the download URIs from the response data
  const downloadedImageUrls = downloadResponses.map(response => response.data.uri);

  return downloadedImageUrls;
};



module.exports = { getCurrentUser, getCountImages, getGettyImagesData };