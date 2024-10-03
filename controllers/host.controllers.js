const Property = require('../models/property.models');
const cloudinary = require("../utils/cloudinary")
const upload = require("../utils/multer")

exports.createProperty =  upload.single('photo'), async (req, res) => {
  try {
    const { title, description, location, beds, price, amenities, } = req.body;

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'apartment',
      public_id: Date.now().toString()
    });
    const newProperty = new Property({
      host: req.user._id, 
      title,
      description,
      location,
      beds,
      price,
      amenities,
      images: result.secure_url,
      status: 'pending'
    });

    await newProperty.save();

    res.status(201).json({ message: 'Property listed successfully', data: newProperty });
  } catch (error) {
    res.status(500).json({ message: 'Error listing property', error: error.message });
  }
};
