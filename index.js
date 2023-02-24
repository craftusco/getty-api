const express = require('express');
const session = require('express-session');
const axios = require('axios');
const { Readable } = require('stream')
const cron = require('node-cron');
const app = express();
const dayjs = require('dayjs')
const knex = require('./config/db');
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
const { getCountImages, getCurrentUser, getGettyImagesData } = require('./api/getty');
const { uploadImages } = require('./api/cloudinary');
const { getBearerToken } = require('./api/auth.getty');



// Middleware to add the Getty access token to each request
app.use(async (req, res, next) => {
  req.token = await getBearerToken(req);
  next();
});

app.get('/stream', async (req, res) => {
  const createReadStream = () => {
    const data = ['Hello', 'Node.js', 'from', 'weBeetle']
    return new Readable({
      encoding: 'utf8',
      read () {
        if (data.length === 0) this.push(null)
        else this.push(data.shift())
      }
    })
  }
  const rs = createReadStream()
  rs.on('data', data => { 
    console.log('Data chunk:\n', data)
  })
  rs.on('end', () => {
    console.log('Read is finished!')
  })
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



// Define cron job outside of the endpoint handler
app.get('/count', async (req, res) => {
  try {
    const [latestCount] = await knex('getty_logs').orderBy('id', 'desc').limit(1);
    const localCount = latestCount ? latestCount.result_count : 0;
    const resultCount = await getCountImages(req);
    const difference = resultCount - localCount;

    if (difference !== 0) {
      await knex('getty_logs').insert({ result_count: resultCount });
      console.log(`Saved new total count ${resultCount} to database`);
    }

    res.json({
      local_count: localCount,
      result_count: resultCount,
      difference: difference
    });
  } catch (error) {
    console.error('Error getting count:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

cron.schedule('*/1 * * * *', async () => {
  try {
    const response = await axios.get('http://localhost:3000/count');
    console.log(response.data);
  } catch (error) {
    console.error('Error calling count:', error);
  }
});


/* Route Sync Images */
app.post('/sync', async (req, res) => {
    const { from, to } = req.query;
    const dateFrom = (from ? dayjs(from).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'));
    const dateTo = (to ? dayjs(to).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'));
    const urls = await getGettyImagesData(req, dateFrom, dateTo);

    if (urls && urls.length > 0) {
      try {
        const uploadedUrls = await uploadImages(urls);
        res.status(200).json(uploadedUrls);
      } catch (error) {
        console.error('Error uploading images:', error);
        res.status(500).json('Error uploading images');
      }
    } else {
      res.status(400).json('No images found to upload');
    }
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