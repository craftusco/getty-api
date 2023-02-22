const express = require('express');
const session = require('express-session');
const app = express();
const dayjs = require('dayjs')
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
const { getCurrentUser, getGettyImagesData } = require('./api/getty');
const { uploadImages } = require('./api/cloudinary');
const { getBearerToken } = require('./api/auth.getty');


// Middleware to add the Getty access token to each request
app.use(async (req, res, next) => {
  req.token = await getBearerToken(req);
  next();
});

app.get('/', async (req, res) => {
  //console.log(req.session); // Add this line
  //const token = await getBearerToken(req);
  const currentUser = await getCurrentUser(req);
  res.json({
    'token': req.token,
    'currentUser': currentUser ?? null
  });
});

/* Route Sync Images */
app.post('/sync', async (req, res) => {
    const { from, to } = req.query;
    const dateFrom = (from ? dayjs(from).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'));
    const dateTo = (to ? dayjs(to).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'));
    const data = await getGettyImagesData(req, dateFrom, dateTo);
    
    /* Response */
    res.json(data);
});

/* Route Test */
  app.post('/test', async (req, res) => {
  const urls = ['https://media.gettyimages.com/id/1363108121/it/foto/blue-light-in-the-dark-room.jpg?s=2048x2048&w=gi&k=20&c=k8SlVCX9SxByagPFJfAXM1K02JZX1HciA5CJuIdbzWo=',
   'https://media.gettyimages.com/id/1134532269/it/foto/eclipse.jpg?s=2048x2048&w=gi&k=20&c=k64J7teDkYGd92wJ8UKSOHBeEYCbmupGzgA_27wjU7E=', 
   'https://media.gettyimages.com/id/1134531699/it/foto/eclipse.jpg?s=2048x2048&w=gi&k=20&c=UwSE6G6mkd51wPzUPcfjwImDq4KVvNi-oV0j7S1wX80='];

  uploadImages(urls)
    .then(uploadedUrls => {
      /* Response */
      res.send(uploadedUrls);
    })
    .catch(error => {
      /* Response */
      res.send('Error uploading images:', error);
    });
    
    
});

// start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});