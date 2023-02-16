const express = require('express')
const app = express()
const port = 3000
// Require cronjob library
const nodeCron = require("node-cron");
// Require the Cloudinary library
const cloudinary = require('cloudinary').v2

const job = nodeCron.schedule("0 0 0 /1 * *", function jobYouNeedToExecute() {
    // Do whatever you want in here. Send email, Make  database backup or download data.
    console.log(new Date().toLocaleString());
  });

app.get('/', (req, res) => {
    res.send('index')
})
app.get('/refresh', (req, res) => {
    res.send('refresh')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})