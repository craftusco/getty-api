// cloudinary.js
const cloudinary = require('cloudinary').v2;
const { cloudName, apiKey, apiSecret } = require('../config/cloudinary');

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret
});

const uploadImages = async (urls) => {
  const uploadedUrls = [];
  /*try {
    for (const url of urls) {
      const result = await cloudinary.v2.uploader.upload(url, {
        folder: '/Getty',
        overwrite: true,
        use_filename: true,
        unique_filename: true,
        resource_type: 'image'
      }).then(res => uploadedUrls.push(res.secure_url));
    }
    
  } catch (error) {
    console.log('Error uploading images:', error);
    throw error;
  }*/
  return urls;
};

module.exports = { uploadImages };
