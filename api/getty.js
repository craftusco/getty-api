// getty.js
const axios = require('axios');
const dayjs = require('dayjs');
const knex = require('../config/db');
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
  const params = {
    date_from: '2023-01-01'
  };
  try {
    const response = await axiosInstance.get('/downloads', { params });
    return response.data.result_count;
  } catch (error) {
    console.error('Error retrieving data:', error.message);
    return null;
  }
};

const getLocalCount = async () => {
  try {
    const result = await knex('getty_downloads')
      .select(
        knex.raw('COUNT(*) as total_local_images'),
        knex.raw('SUM(downloaded = 1) as images_downloaded'),
        knex.raw('SUM(downloaded = 0) as images_to_download')
      );
    return result[0];
  } catch (error) {
    console.error('Error getting counts:', error);
    return null;
  }
};



/* Get User Downloads */
const getGettyImagesData = async (req) => {
  const axiosInstance = await instance(req);
  const pageSize = 100;
  let pageNumber = 1;
  let totalData = [];
  
  while (true) {
    const params = {
      date_from: dayjs().startOf('day').valueOf(),
      page_size: pageSize,
      page: pageNumber
    };
    //console.log(params)
    
    try {
      const response = await axiosInstance.get('/downloads', { params });
      const data = response.data.downloads;
      //console.log('resp', response.data)
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
  
  
  /* Create an array of objects containing the ID of each downloaded image */
  const rows = totalData.map(item => {
    return { id: item.id };
  });
  //console.log(totalData)
  
  // Insert the IDs into the database
  try {
    await knex('getty_downloads').insert(rows);
    //console.log('IDs inserted successfully!');
  } catch (error) {
    console.error('Error inserting IDs into database:', error.message);
    return null;
  }

  // Return an array of the downloaded image IDs
  const downloadedIds = totalData.map(item => item.id);
  return downloadedIds;
};


/* Get User Downloads */
const createGettyURLS = async (req) => {
  const axiosInstance = await instance(req);

  try {
    // Get all the IDs from the database
    const rows = await knex('getty_downloads').select('id').where('downloaded', false ).limit(25);
    //console.log(rows)

    // Create an array of promises for each image download request
    const downloadPromises = rows.map(row => {
      const imageId = row.id;
      const downloadUrl = `${GETTY_API_URL}/downloads/images/${imageId}?auto_download=false&use_team_credits=true`;
      return axiosInstance.post(downloadUrl);
    });

    // Execute all image download requests together
    const downloadResponses = await axios.all(downloadPromises);

    // Get the download URIs from the response data
    const downloadedImageUrls = downloadResponses.map(response => response.data.uri);

    try {
      // Update the rows that have been downloaded
      const updateLocalData = await knex('getty_downloads')
        .update({ downloaded: 1 })
        .whereIn('id', rows.map(row => row.id)); 
      console.log('updateLocalData', updateLocalData);
    } catch (error) {
      console.error('Error updating Getty Images data:', error.message);
    }

    //console.log(downloadedImageUrls);
    return downloadedImageUrls;
  } catch (error) {
    console.error('Error retrieving Getty Images data:', error.message);
  } finally {
    knex.destroy();
  }
};









module.exports = { getCurrentUser, getCountImages, createGettyURLS, getLocalCount, getGettyImagesData };