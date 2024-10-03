const hostModel = require("../models/host.model")
const signupModel = require("../models/signup.models")
const Property = require('../models/property.models'); 
const Booking = require('../models/booking.model'); 
const mailer = require("../nodemailer/mailer")

const adminLogin = async (req, res, next) => {
  try {
    const user = await guestModel.findById(req.user._id);
    if (user.email !== 'getshortment@gmail.com') {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllHosts = async (req, res) => {
  try {
    const hosts = await hostModel.find({});
    res.status(200).json(hosts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getAllGuests = async (req, res) => {
  try {
    const guest = await signupModel.find({});
    res.status(200).json(guest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({}); 
    res.status(200).json({ bookings });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: '🔥 INTERNAL SERVER ERROR' });
  }
};

const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find({}).populate('host', 'profileName email'); 
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const approveProperty = async (req, res) => {
  try {
    const propertyId = req.params.id;
    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    property.status = 'approved';
    await property.save();

    mailer.sendMail({
      from: 'Shortment',
      to: property.host.email,
      subject: 'Approval for your property offer',
      text: `Hello ${property.host.profileName}, your property "${property.propertyName}" has been approved.`,
      html: `<p>Dear <strong>${property.host.profileName}</strong>,</p>
      <p>This is to inform you that your property located at ${property.propertyName} has been approved.</p>
        <p>your property "${property.propertyName}" has been approved.</p>
        <p>Best regards,<br>Shortment teams</p>`
    
    });

    res.status(200).json({ message: 'Property approved successfully', property });
  } catch (error) {
    res.status(500).json({ message: 'Error approving property', error });
  }
};

const rejectProperty = async (req, res) => {
  try {
    const propertyId = req.params.id;
    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    property.status = 'declined';
    await property.save();

    mailer.sendMail({
      from: 'Shortment',
      to: property.host.email,
      subject: 'Your property has been declined',
      text: `Hello ${property.host.profileName}, your property "${property.propertyName}" has been declined.`,
      html: `<p>Dear <strong>${property.host.profileName}</strong>,</p>
      <p>A warm welcome to Shortment!</p>
        <p>your property "${property.propertyName}" has been declined.</p>
        <p>Best regards,<br>Shortment teams</p>`
        });

    res.status(200).json({ message: 'Property rejected', property });
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting property', error });
  }
};


module.exports = {
  getAllHosts,
  getAllGuests,
  adminLogin, 
  getAllProperties,
  approveProperty,
  rejectProperty,
  getAllBookings
}