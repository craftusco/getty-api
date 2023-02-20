const express = require('express')
const app = express()
const port = 3000
// Require cronjob library
const nodeCron = require("node-cron");
// Require the Cloudinary library
const cloudinary = require('cloudinary').v2

// Require the Getty library
var api = require("gettyimages-api");
var creds_getty = require('./config/getty');
var client = new api (creds_getty);

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
app.get('/refresh', (req, res) => {
    res.send('refresh')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})