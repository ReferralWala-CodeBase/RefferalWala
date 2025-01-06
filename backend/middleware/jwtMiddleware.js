const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();



const jwtMiddleware = async (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId) || await User.findById(decoded._id);  // Use both because one work in manual and one in google;

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    req.user = { userId: user._id, isAdmin: user.isAdmin }; // Include isAdmin property
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

module.exports = jwtMiddleware;
