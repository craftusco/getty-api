// getty.js
const axios = require('axios');
const dayjs = require('dayjs');
const path = require('path');
const knex = require('../config/db');
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

/* Get Local Count */
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
const retrieveGettyImagesData = async (req) => {
  const axiosInstance = await instance(req);
  const pageSize = 50;
  let pageNumber = 1;
  let totalData = [];
  
  while (true) {
    const params = {
      date_from: '2018-01-01', //dayjs().startOf('day').format('YYYY-MM-DD'),
      page_size: pageSize,
      page: pageNumber
    };
    //console.log(params)
    
    try {
      const response = await axiosInstance.get('/downloads', { params });
      const data = response.data.downloads;
      //console.log('resp', response)
      // If there's no data in the response, break out of the loop
      if (data.length === 0) {
        break;
      }

      

      totalData = totalData.concat(data);
      pageNumber++;
    } catch (error) {
      console.error('Error retrieving Getty Images API:', error.message);
      return null;
    }
  }
  
  
  /* Create an array of objects containing the ID of each downloaded image */
  const rows = totalData.map(item => {
    const filenameJSON = path.parse(path.basename(item.thumb_uri)).name.replace(/\?.*/, '');
   
    return { id: item.id, product_type: item.product_type, filename: filenameJSON };
  });
  //console.log(totalData)
  //console.table(rows);
  // Insert the IDs into the database
  try {
    await knex('getty_downloads').insert(rows);
    console.log('IDs inserted successfully!');
    return {success: true, message: "Images downloaded successfully"};
  } catch (error) {
    console.error('Error inserting IDs into database:', error.message);
    return { success: false, error: error.message };
  }

};


/* Get User Downloads */
const retrieveGettyUri = async (req) => {
  const axiosInstance = await instance(req);
  try {
    // Return an array of the downloaded image IDs
    const ids = await knex('getty_downloads').select('id').where({'downloaded': false}).whereNotNull('uri').limit(50).pluck('id');
    //console.log(ids);


    // Retrieve metadata for the images
    const response = await Promise.all(ids.map(async id => {
      try {
        const imageResponse = await axiosInstance.post(`${GETTY_API_URL}/downloads/images/${id}?auto_download=false`);
        await knex('getty_downloads').where('id', id).update({ uri: imageResponse.data.uri });
        //console.log(imageResponse.data);
      } catch (error) {
        console.error(`Error updating URI for image ID ${id}:`, error.message);
        return null;
      }
    }));
    
    return response.filter(image => image !== null);
  } catch (error) {
    console.error('Error retrieving or updating data:', error.message);
    return null;
  }
};



/* Get Getty Meta */
const retrieveGettyMeta = async (req) => {
  const axiosInstance = await instance(req);
  try {
    // Return an array of the downloaded image IDs
    const ids = await knex('getty_downloads').select('id').where({'downloaded': false}).whereNotNull('meta').limit(50).pluck('id');
    
    /* Concat IDs */
    const idString = ids.join(',');
    //console.log(ids);
    //console.log(idString);
    
    // Retrieve Metadata for the images
    const response = await axiosInstance.get(`${GETTY_API_URL}/images?ids=${idString}`);
    //console.log(response);
    // Update Metadata in the database for each image
    await Promise.all(response.data.images.map(async image => {
      try {
        await knex('getty_downloads').where('id', image.id).update({ Meta: JSON.stringify(image) });
      } catch (error) {
        console.error(`Error updating Metadata for image ID ${image.id}:`, error.message);
      }
    }));
    
    return response.data;
  } catch (error) {
    console.error('Error retrieving or updating data:', error.message);
    return null;
  }
};










module.exports = { getCurrentUser, getCountImages, retrieveGettyUri, getLocalCount, retrieveGettyImagesData, retrieveGettyMeta };