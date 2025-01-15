const Contact = require('../models/Contact');

exports.createContactMessage = async (req, res) => {
  try {
    const { firstName, lastName, email, mobile, message } = req.body;

    const newContact = new Contact({
      firstName,
      lastName,
      email,
      mobile,
      message,
    });

    await newContact.save();
    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully!',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to send the message.',
      error: error.message,
    });
  }
};
