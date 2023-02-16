const express = require('express')
const app = express()
const port = 3000

// Require the Cloudinary library
const cloudinary = require('cloudinary').v2

app.get('/', (req, res) => {
  res.send('Hello World!')
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})