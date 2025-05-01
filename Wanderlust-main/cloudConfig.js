const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
}); //this is used to configure the cloudinary with the cloud_name, api_key and api_secret

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wanderlust_DEV',
      allowedFormat: async (req, file) => ['png','jpg','jpeg'], // supports promises as well
    },
});

module.exports= {
    storage,
    cloudinary
}