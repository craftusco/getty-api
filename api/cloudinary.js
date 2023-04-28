// cloudinary.js
const cloudinary = require('cloudinary').v2;
const { cloudName, apiKey, apiSecret } = require('../config/cloudinary');
const knex = require('../config/db');


cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret
});

/* Upload Images to Cloudinary */

const uploadImages = async () => {
  const rows = await knex("getty_downloads")
    .select('*')
    .where({ downloaded: false })
    .havingNotNull('uri')
    .limit(100); //use "andWhereNotNull" instead of "havingNotNull"

  const uploadedImages = [];
  for (const row of rows) {
    //use "row" instead of "url" to represent each row
    const folder =
      row.product_id === "easyaccess"
        ? "/Getty/Dedicated photographers"
        : "/Getty/Editorial Subscriptions";
        //set parsed Object to Context Meta on CLoudinary
        const parsedRow = JSON.parse(row.meta);
      const options = {
        folder,
        overwrite: true,
        context: JSON.parse(row.meta), //use "row" instead of "url" to access the meta property
        public_id: row.filename,
        title: row.filename,
        unique_filename: false,
        resource_type: "image",
      };
    //replace caption with description of cloudinary
    options.context.caption = options.context.title;
    options.context.alt = options.context.caption;
    options.context.photographer = options.context.artist;
    // Now delete them fro moriginal json
    delete options.context.title;
    delete options.context.caption;
    delete options.context.artist;

    try {
      const result = await cloudinary.uploader.upload(row.uri, options); //use "row.uri" instead of "url"
      uploadedImages.push(result);
       
      //Now update to downloaded TRUE all ids uplaoded to Cloudinary
      const idsToUpdate = rows.map(row => row.id); // Assuming the primary key of your table is named "id"

      await knex("getty_downloads")
        .whereIn("id", idsToUpdate)
        .update({ downloaded: true });

      //console.log(`Image uploaded successfully: ${result.public_id}`);
    } catch (error) {
      console.error("Error uploading image:", error.message);
    }
  }
  return uploadedImages;
};




/* Test Upload with rename */
const testUpload = async () => {
  // Define the image URL and contextual Metadata
  const imageUrl = 'https://via.placeholder.com/800x533/FF0000/FFFFFF?text=gettyimage';

  // Upload the image and add the contextual Metadata
  cloudinary.uploader.upload(imageUrl, { 
    public_id: 'my_image', 
    context: { 
      caption: 'A beautiful sunset',
      location: 'San Francisco',
      year: '2023'
    }, 
    overwrite: true 
  })
    .then(uploadResult => {
      console.log(uploadResult);
    })
    .catch(error => console.error(error));
  };




module.exports = { uploadImages, testUpload };