// cloudinary.js
const cloudinary = require('cloudinary').v2;
const { cloudName, apiKey, apiSecret } = require('../config/cloudinary');

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret
});

/* Upload Images by given URLS */
const uploadImages = async (urls) => {
  const uploadedImages = [];
  for (const url of urls) {
    const options = {
      folder: `/Getty`, // set public_id to the desired filename
      overwrite: true, // overwrite existing images
      use_filename: true, 
      unique_filename: false, // overwrite existing images
      resource_type: 'image' // ensure that Cloudinary treats the file as an image
    };
    await cloudinary.uploader.upload(url, options)
      .then(result => uploadedImages.push(result))
      .catch(error => console.error('Error uploading image:', error.message));
  }
  return uploadedImages;
};


/* Upload Images by given URLS */
const bulkEdit = async (urls) => {
  const uploadedImages = [];
  for (const url of urls) {
    const options = {
      folder: `c39a0e23630947bbce08d6a5cb47129e37`, // set public_id to the desired filename
      overwrite: true, // overwrite existing images
      use_filename: true, 
      unique_filename: false, // overwrite existing images
      resource_type: 'image' // ensure that Cloudinary treats the file as an image
    };
    await cloudinary.uploader.upload(url, options)
      .then(result => uploadedImages.push(result))
      .catch(error => console.error('Error uploading image:', error.message));
  }
  return uploadedImages;
};




module.exports = { uploadImages, bulkEdit };