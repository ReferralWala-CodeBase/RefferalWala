const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const https = require('https');
const User = require('../models/User'); // Adjust path as necessary

// Configure Passport Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = new User({
            googleId: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
            isOTPVerified: true, // Skip OTP for Google sign-ins
          });
          await user.save();
        }
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

// Serialize and Deserialize User for Sessions
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Middleware to handle JWT Token Generation
async function handleGoogleLogin(req, res) {
  const { code } = req.body;

  try {
    const googleData = await exchangeCodeForGoogleData(code);
    let user = await User.findOne({ email: googleData.email });

    if (!user) {
      user = new User({
        name: googleData.name,
        email: googleData.email,
      });
      await user.save();
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '3d',
    });

    res.status(200).json({ token, user, userId: user._id, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error during Google login' });
  }
}

// Exchange Code for Google Data (Token and User Info)
async function exchangeCodeForGoogleData(code) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: 'authorization_code',
    });

    const options = {
      hostname: 'oauth2.googleapis.com',
      path: '/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
      },
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => (responseData += chunk));
      res.on('end', () => {
        const tokenResponse = JSON.parse(responseData);
        const accessToken = tokenResponse.access_token;

        // Fetch Google User Info
        const userInfoOptions = {
          hostname: 'www.googleapis.com',
          path: '/oauth2/v1/userinfo',
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };

        const userInfoReq = https.request(userInfoOptions, (userInfoRes) => {
          let userInfoData = '';

          userInfoRes.on('data', (chunk) => (userInfoData += chunk));
          userInfoRes.on('end', () => resolve(JSON.parse(userInfoData)));
        });

        userInfoReq.on('error', (error) => {
          console.error('Error fetching user info:', error);
          reject(new Error('Failed to retrieve Google user data'));
        });

        userInfoReq.end();
      });
    });

    req.on('error', (error) => {
      console.error('Error exchanging code for Google data:', error);
      reject(new Error('Failed to retrieve Google user data'));
    });

    req.write(data);
    req.end();
  });
}

module.exports = { passport, handleGoogleLogin };
