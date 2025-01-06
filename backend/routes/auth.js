const express = require('express');
const { passport, handleGoogleLogin } = require('../config/passport.js');
const router = express.Router();

// Google Login with OAuth Code
router.post('/googleLogin', handleGoogleLogin);

// Google OAuth Redirect
router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    const token = jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });
    res.redirect(`/auth/success?token=${token}`);
  }
);

module.exports = router;
