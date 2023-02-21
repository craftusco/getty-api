const express = require('express')
const app = express()
const port = 3000
// Require cronjob library
const nodeCron = require("node-cron");
// Require the Cloudinary library
var cloudinary = require('cloudinary').v2;

// Require the Getty library
var api = require("gettyimages-api");
var creds_getty = require('./config/getty');
var client = new api (creds_getty);

cloudinary.config({
  cloud_name: 'european-athletics',
  api_key: '624624683124292',
  api_secret: '-DJnHDsCmJhCq48g39Cpjz8KNC0'
});

/*
const job = nodeCron.schedule("0 0 0 0 * *", function jobYouNeedToExecute() {
    // Do whatever you want in here. Send email, Make  database backup or download data.
    console.log(new Date().toLocaleString());
  });
*/
app.get('/', (req, res) => {
  client.customrequest().withRoute("/account/download/individual/all").withMethod("get")
    .execute().then(response => {
      res.send(response);
    }, err => {
        throw err;
    });
})


app.post('/upload', (req, res) => {
  cloudinary.uploader
  .upload("https://via.placeholder.com/800x533/15202B/FFFFFF?text=gettyimage", {public_id: "/Getty",})
  .then((result) => {
    res.send(result)
  })
  .catch((error) => {
    res.send(error);
  });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})