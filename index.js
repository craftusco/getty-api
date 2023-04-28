const express = require('express');
const session = require('express-session');
const axios = require('axios');
const { Readable } = require('stream')
const cron = require('node-cron');
const app = express();
const dayjs = require('dayjs')
const knex = require('./config/db');
const { logMessage } = require('./api/logs');



// add session middleware
app.use(session({
  secret: 'gettySecret', // You should replace this with your own secret key
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, unset: 'destroy' } // set this to true if using HTTPS
}));


// Require cronjob library
const nodeCron = require("node-cron");


// Require the Getty library
const { getCountImages, getLocalCount, getCurrentUser, retrieveGettyImagesData, retrieveGettyUri, retrieveGettyMeta } = require('./api/getty');
const { uploadImages, testUpload } = require('./api/cloudinary');
const { getBearerToken } = require('./api/auth.getty');



// Middleware to add the Getty access token to each request
app.use(async (req, res, next) => {
  req.token = await getBearerToken(req);
  /* dynamic URL */
  global.currentUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  next();
});


app.get('/user', async (req, res) => {
  //console.log(req.session); // Add this line
  //const token = await getBearerToken(req);
  const currentUser = await getCurrentUser(req);
  res.json({
    'token': req.token,
    'currentUser': currentUser ?? null
  });
});



// Define cron job outside of the endpoint handler
app.get('/', async (req, res) => {
  try {
    // get count from localhost 
    const local = await getLocalCount();
    //console.log('local', local);
    // Get count from Getty 
    const gettyCount = await getCountImages(req);
 
    /* Check if Getty count is greater than local count */
    if (gettyCount > local?.total_local_images) {
      
      const refresh = await retrieveGettyImagesData(req);
    }
   


    res.json({
      total_getty_images: gettyCount,
        ...local
    });
    logMessage('Success refresh files');
  } catch (error) {
    console.error('Error getting count:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


/* Route Sync Images */
app.post('/upload', async (req, res) => {
  try {

    const updateMETA = await retrieveGettyMeta(req); 
    const updateURI = await retrieveGettyUri(req); 
    

    const uplodaProcess = await uploadImages(req);

    res.json({success: true, message: "Images downloaded successfully"});

  } catch (error) {
    logMessage('Error uploading images:');
    console.error('Error uploading images:', error);
    res.status(500).json('Error uploading images');
  }
});



/* Route Logs */
  app.get('/logs', async (req, res) => {
    try {
      const data = await knex('getty_logs').orderBy('id', 'desc');
      res.status(200).json(data);
    } catch (error) {
      console.error('Error getting count:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
    
});

/* Route Test */
  app.post('/test', async (req, res) => {
  testUpload();
});


/* 1ST CRONJOB TO CHECK COUNTS */
cron.schedule('*/2 * * * *', async () => {
  try {
    const response = await axios.get(`${global.currentUrl}`);
    console.log(response.data);
  } catch (error) {
    logMessage('Error calling /count route');
    console.error('Error calling count route:', error);
  }
});

/* 2ND CRONJOB TO SYNC IMAGES */
cron.schedule('*/5 * * * *', async () => {
  try {
    const response = await axios.post(`${global.currentUrl}/sync`);
    console.log(response.data);
  } catch (error) {
    logMessage('Error calling /sync route');
    console.error('Error calling sync route:', error);
  }
});


// start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});