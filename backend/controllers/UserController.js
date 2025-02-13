const User = require('../models/User');
const JobPost = require('../models/JobPost');
const Notification = require('../models/Notification');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Utility to load email templates
const getEmailTemplate = (templateName) => {
  const templatePath = path.join(__dirname, '..', 'email_templates', templateName);
  try {
    return fs.readFileSync(templatePath, 'utf-8');
  } catch (error) {
    console.error(`Error loading template ${templateName}:`, error);
    throw new Error('Failed to load email template');
  }
};
require('dotenv').config();

const sendEmailTemplate = async (recipient, subject, templateName, replacements = {}) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_EMAIL,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  // Load the email template
  let htmlContent = getEmailTemplate(templateName);

  // Replace placeholders in the template
  for (const [key, value] of Object.entries(replacements)) {
    const regex = new RegExp(`{{${key}}}`, 'g'); // e.g., replace {{name}}
    htmlContent = htmlContent.replace(regex, value);
  }

  const mailOptions = {
    from: process.env.GMAIL_EMAIL,
    to: recipient,
    subject,
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
};

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


    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Validate mobile number (check if it's a number and contains exactly 10 digits)
    if (!mobileNumber || !/^\d{10}$/.test(mobileNumber)) {
      return res.status(400).json({ message: 'Invalid mobile number.' });
    }

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

    user = new User({
      email,
      mobileNumber,
      password: hashedPassword,
      otp, // Save the OTP to the user document
    });

    await user.save();

    try {
      await sendEmailTemplate(
        email,
        'Verify Your OTP',
        'otp_template.html', // Replace with your OTP email template filename
        { otp } // Replace {{otp}} in the template with the generated OTP
      );
      console.log(`OTP email sent to ${email}`);
    } catch (err) {
      console.error(`Failed to send OTP email to ${email}:`, err);
      return res.status(500).json({ error: 'Failed to send OTP email.' });
    }

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

    // Send the registration email
    try {
      await sendEmailTemplate(
        email, // recipient's email
        'Welcome to Referralwala!', // subject
        'registration_success.html', // template file name
        { email } // replacements for the template (add more placeholders as needed)
      );
      console.log(`Welcome email sent to ${email}`);
    } catch (err) {
      console.error(`Failed to send welcome email to ${email}:`, err);
    }

    res.json({ message: 'OTP verified successfully and welcome email sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
exports.verifyCompanyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body; // Company email & OTP in the body

    // Find the user with the given company email
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if OTP matches
    if (user.presentCompany.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // Verify company email
    user.presentCompany.companyEmail = email;
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
    const expiresIn = '3d';

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


// exports.resendOTP = async (req, res) => {
//   try {
//     const { email } = req.body;

//     // Check if the user exists
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     // Generate new OTP
//     const otp = generateOTP();  // Ensure generateOTP() returns a correct value

//     // Update the OTP in the database
//     user.otp = otp; 
//     await user.save();  // Ensure the new OTP is saved before sending it

//     console.log("New OTP saved:", otp);

//     // Send the new OTP via email
//     try {
//       await sendEmail(email, otp);
//       console.log(`New OTP email sent to ${email}`);
//       return res.json({ message: 'New OTP sent to your email.' });
//     } catch (emailError) {
//       console.error(`Failed to send OTP email to ${email}:`, emailError);
//       return res.status(500).json({ error: 'Failed to send OTP email.' });
//     }

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

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

    res.json({ message: 'New OTP sent to your email.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Find the user with the given company email
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // To initialized presentCompany 
    if (!user.presentCompany) {
      user.presentCompany = {};
    }

    // Check if the company email has already been verified
    if (user.presentCompany.companyEmail === email) {
      return res.status(400).json({ message: 'Company email already verified' });
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
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};


exports.followUser = async (req, res) => {
  try {
    const { id } = req.params; // ID of the user to follow
    const { userId } = req.body; // ID of the user following

    if (id === userId) {
      return res.status(400).json({ message: 'You cannot follow yourself' });
    }

    const userToFollow = await User.findById(id);
    const follower = await User.findById(userId);

    if (!userToFollow || !follower) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already following
    if (follower.following.includes(id)) {
      return res.status(400).json({ message: 'Already following this user' });
    }

    // Follow the user
    follower.following.push(id);
    userToFollow.followers.push(userId);
    await follower.save();
    await userToFollow.save();

    res.status(200).json({ message: 'You are now following this user' });
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
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if not following
    if (!unfollower.following.includes(id)) {
      return res.status(400).json({ message: 'Not following this user' });
    }

    // Unfollow the user
    unfollower.following.pull(id);
    userToUnfollow.followers.pull(userId);
    await unfollower.save();
    await userToUnfollow.save();

    res.status(200).json({ message: 'You have unfollowed this user' });
  } catch (err) {
    console.error('Error unfollowing user:', err.message);
    res.status(500).send('Server Error');
  }
};


exports.getFollowers = async (req, res) => {
  try {
    const { id } = req.params; // ID of the user whose followers are to be fetched
    const user = await User.findById(id).populate('followers', 'firstName lastName email profilePhoto'); // Populate to get user details

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
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
    const user = await User.findById(id).populate('following', 'firstName lastName email profilePhoto'); // Populate to get user details

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
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

// Search in Job Schema and User Schema
exports.searching = async (req, res) => {
  const { query } = req.body; // Get the search input
  if (!query || !query.trim()) {
    return res.json({ jobResults: [], userResults: [] }); // Return empty results for empty query
  }

  // Clean the input query: remove extra spaces and split into parts
  const queryParts = query.trim().split(/\s+/); // Split by spaces
  const regexQuery = queryParts.join('|'); // Combine parts into a regex pattern

  try {
    // Define search criteria for JobPost collection
    const jobSearchCriteria = {
      $or: [
        { companyName: { $regex: regexQuery, $options: 'i' } }, // Case-insensitive search
        { jobRole: { $regex: regexQuery, $options: 'i' } },
        { location: { $regex: regexQuery, $options: 'i' } },
        { workMode: { $regex: regexQuery, $options: 'i' } },
      ],
    };

    // Define search criteria for User collection
    const userSearchCriteria = {
      $or: [
        { email: { $regex: regexQuery, $options: 'i' } }, // Case-insensitive search
        { firstName: { $regex: regexQuery, $options: 'i' } },
        { lastName: { $regex: regexQuery, $options: 'i' } },
      ],
    };

    // Execute search queries with a limit of 20 results each
    const jobResults = await JobPost.find(jobSearchCriteria).limit(20);
    const userResults = await User.find(userSearchCriteria).limit(20);

    // Return the combined results
    res.json({ jobResults, userResults });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getDeactivated = async (req, res) => {
  const { isActivate } = req.body;

  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isActivate = isActivate;
    await user.save();

    // Send response back to the client
    res.status(200).json({ message: 'User deactivated successfully' });
  }
  catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error while deactivated user' });
  }
};

exports.getDelect = async (req, res) => {
  const { email } = req.body; // Email of the user to be deleted
  const { id } = req.params; // ID of the user for removing associated activity

  // Validate input
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const usersFollowing = await User.find({ following: id });  // Fetch users that the user is following
    const usersWithFollower = await User.find({ followers: id });  // Fetch users that follow the user
    const jobPosts = await JobPost.find();  // Fetch all job posts to check for applicants

    // Check if the user follows anyone
    if (!usersFollowing.length) {
      console.log("This user is not following anyone.");
    }

    // Check if anyone is following the user
    if (!usersWithFollower.length) {
      console.log("No users are following this user.");
    }

    const deletedUser = await User.findOneAndDelete({ email }); // Find and delete the user by email

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove the user from others' following lists
    for (const user of usersFollowing) {
      user.following.pull(id);
      await user.save();
    }

    // Remove the user from others' followers lists
    for (const user of usersWithFollower) {
      user.followers.pull(id);
      await user.save();
    }

    // Remove the user from the applicants list of job posts
    for (const jobPost of jobPosts) {
      const applicantIndex = jobPost.applicants.indexOf(id);
      if (applicantIndex !== -1) {
        jobPost.applicants.pull(id);
        await jobPost.save();
      } else {
        console.log("User is not in any job applicants list.");
      }
    }

    res.status(200).json({ message: `User and associated activities deleted successfully.`, user: deletedUser });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error while deleting user' });
  }
};
