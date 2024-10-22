const express = require('express');
const passport = require('passport');
const router = express.Router();

// Route for Google authentication
router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Callback route for Google to redirect to after successful login
router.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login', // Redirect to login if failure
    session: false, // Disable sessions since you're using JWT
  }),
  (req, res) => {
    // Issue JWT upon successful login
    const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    res.json({ token, userId: req.user._id });
  }
);

module.exports = router;
