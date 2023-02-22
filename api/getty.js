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

/* Get User Downloads */
const getGettyImagesData = async (req, dateFrom, dateTo) => {
  const axiosInstance = await instance(req);
  const params = {
    date_from: dateFrom,
    date_to: dateTo
  }
  try {
    const response = await axiosInstance.get('/downloads', { params });
    const data = response.data.downloads;
    //console.table(data);
    // Create an array to hold the URLs of the downloaded images
    const downloadedImageUrls = [];
    // Loop through each item in the response data array
    for (const item of data) {
      try {
        // Get the image ID from the item
        const imageId = item.id;
        // Construct the URL for downloading the image with the given ID
        const downloadUrl = `${GETTY_API_URL}/downloads/images/${imageId}?auto_download=false&use_team_credits=false`;
        // Make a POST request to the download URL
        const downloadResponse = await axiosInstance.post(downloadUrl);
        // Extract the download URI from the response
        const downloadUri = downloadResponse.data.uri;
        // Add the download URI to the downloadedImageUrls array
        downloadedImageUrls.push(downloadUri);
      } catch (error) {
        console.error(`Error downloading image with asset ID ${item.asset_id}:`, error.message);
      }
    }
    return { /*data*/ downloadedImageUrls };
  } catch (error) {
    console.error('Error retrieving Getty Images data:', error.message);
    return null;
  }
};


module.exports = { getCurrentUser, getGettyImagesData };