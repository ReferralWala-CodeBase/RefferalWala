const User = require('../models/User');
const Notification = require('../models/Notification');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

require('dotenv').config();

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendEmail = async (recipient, otp, subject = 'OTP for Verification') => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_EMAIL,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_EMAIL,
    to: recipient,
    subject,
    text: `Your OTP for Verification is: ${otp} . It's valid for 30 minutes`,
  };

  await transporter.sendMail(mailOptions);
};

exports.registerUser = async (req, res) => {
  try {
    const { email, mobileNumber, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: email }, { mobileNumber: mobileNumber }],
    });

    if (existingUser) {
      const errorMessage =
        existingUser.email === email
          ? 'User with this email already exists'
          : 'User with this mobile number already exists';
      return res.status(400).json({ error: errorMessage });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate OTP and send it via email
    const otp = generateOTP();
    await sendEmail(email, otp);

    user = new User({
      email,
      mobileNumber,
      password: hashedPassword,
      otp, // Save the OTP to the user document
    });

    await user.save();

    res.json({ message: 'Please verify OTP sent to your email before logging in.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.verifyOTP = async (req, res) => {
  try {
    console.log('Received request body:', req.body);
    const { email, otp } = req.body;
    console.log('Email:', email);
    console.log('OTP:', otp);

    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.isOTPVerified) {
      return res.status(400).json({ error: 'OTP already verified' });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    user.isOTPVerified = true;
    user.otp = null; // Clear the OTP after verification
    await user.save();

    res.json({ message: 'OTP verified successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.verifyCompanyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body; // Company email & OTP in the body

    // Find the user with the given company email
    const user = await User.findOne({ 'presentCompany.companyEmail': email });
    if (!user) {
      return res.status(404).json({ error: 'User not found with this company email' });
    }

    // Check if the company email has already been verified
    if (user.presentCompany.CompanyEmailVerified) {
      return res.status(400).json({ error: 'Company email already verified' });
    }

    // Check if OTP matches
    if (user.presentCompany.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // Verify company email
    user.presentCompany.CompanyEmailVerified = true;
    user.presentCompany.otp = null; // Clear OTP after verification
    await user.save();

    res.status(200).json({ message: 'Company email verified successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};



exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if the OTP is verified before allowing login
    if (!user.isOTPVerified) {
      return res.status(403).json({ error: 'Please verify OTP first' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const expiresIn = '1d';

    // Create and send the JWT token for successful login
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn });
    res.json({ token, isOTPVerified: true, userId: user._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};





exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate OTP and send it via email
    const otp = generateOTP();
    await sendEmail(email, otp, 'OTP for Password Reset');

    // Save the OTP to the user document for password reset verification
    user.otp = otp;
    await user.save();

    res.json({ message: 'Please check your email for the OTP to reset your password.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify the OTP
    if (user.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // Update the user's password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    user.password = hashedPassword;
    user.otp = null; // Clear the OTP after password reset
    await user.save();

    res.json({ message: 'Password reset successful. You can now login with the new password.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};



exports.resendOTP = async (req, res) => {
  // Implementation of resendOTP function
  try {
    const { email } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate new OTP and send it via email
    const otp = generateOTP();
    await sendEmail(email, otp);

    // Save the new OTP to the user document
    user.otp = otp;
    await user.save();
    console.log("otp saved")

    res.json({ message: 'OTP sent to your email.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};



exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Find the user with the given company email
    const user = await User.findOne({ 'presentCompany.companyEmail': email });
    if (!user) {
      return res.status(404).json({ error: 'User not found with this company email' });
    }

    // Generate new OTP
    const otp = generateOTP();

    // Send the OTP via email
    await sendEmail(email, otp);

    // Save the new OTP to the user's presentCompany.otp field
    user.presentCompany.otp = otp;
    await user.save();

    res.json({ message: 'OTP sent to the company email.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};



// Get profile by ID
exports.getProfileById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get profile by email
exports.getProfileByEmail = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all profiles
exports.getAllProfiles = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update profile by ID
exports.updateProfileById = async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.followUser = async (req, res) => {
  try {
    const { id } = req.params; // ID of the user to follow
    const { userId } = req.body; // ID of the user following

    if (id === userId) {
      return res.status(400).json({ msg: 'You cannot follow yourself' });
    }

    const userToFollow = await User.findById(id);
    const follower = await User.findById(userId);

    if (!userToFollow || !follower) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check if already following
    if (follower.following.includes(id)) {
      return res.status(400).json({ msg: 'Already following this user' });
    }

    // Follow the user
    follower.following.push(id);
    userToFollow.followers.push(userId);
    await follower.save();
    await userToFollow.save();

    res.status(200).json({ msg: 'You are now following this user' });
  } catch (err) {
    console.error('Error following user:', err.message);
    res.status(500).send('Server Error');
  }
};

// Unfollow a user
exports.unfollowUser = async (req, res) => {
  try {
    const { id } = req.params; // ID of the user to unfollow
    const { userId } = req.body; // ID of the user unfollowing

    const userToUnfollow = await User.findById(id);
    const unfollower = await User.findById(userId);

    if (!userToUnfollow || !unfollower) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check if not following
    if (!unfollower.following.includes(id)) {
      return res.status(400).json({ msg: 'Not following this user' });
    }

    // Unfollow the user
    unfollower.following.pull(id);
    userToUnfollow.followers.pull(userId);
    await unfollower.save();
    await userToUnfollow.save();

    res.status(200).json({ msg: 'You have unfollowed this user' });
  } catch (err) {
    console.error('Error unfollowing user:', err.message);
    res.status(500).send('Server Error');
  }
};

exports.getFollowers = async (req, res) => {
  try {
    const { id } = req.params; // ID of the user whose followers are to be fetched
    const user = await User.findById(id).populate('followers', 'firstName lastName email profileImg'); // Populate to get user details

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.status(200).json({ followers: user.followers });
  } catch (err) {
    console.error('Error fetching followers:', err.message);
    res.status(500).send('Server Error');
  }
};

exports.getFollowing = async (req, res) => {
  try {
    const { id } = req.params; // ID of the user whose following list is to be fetched
    const user = await User.findById(id).populate('following', 'firstName lastName email profileImg'); // Populate to get user details

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.status(200).json({ following: user.following });
  } catch (err) {
    console.error('Error fetching following list:', err.message);
    res.status(500).send('Server Error');
  }
};


// Get notifications for a user
exports.getNotifications = async (req, res) => {
  try {
    const { userId } = req.params; // ID of the user for whom notifications are to be fetched
    const notifications = await Notification.find({ user: userId })
      .populate('post', 'title') // Adjust to your post model fields
      .sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (err) {
    console.error('Error fetching notifications:', err.message);
    res.status(500).send('Server Error');
  }
};

exports.getDelect = async (req, res) => {
  const { email } = req.body; // Ensure the request contains the email

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const result = await User.findOneAndDelete({ email });

    if (!result) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully', user: result });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error while deleting user' });
  }
}
