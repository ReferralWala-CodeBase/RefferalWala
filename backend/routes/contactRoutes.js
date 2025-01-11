const express = require('express');
const router = express.Router();
const contactController = require('../controllers/ContactController');

// POST route to submit the "Contact Us" form
router.post('/form', contactController.createContactMessage);

module.exports = router;
