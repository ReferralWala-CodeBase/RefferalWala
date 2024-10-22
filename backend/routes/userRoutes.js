
const express = require('express');
const router = express.Router();
const { registerUser, loginUser, verifyOTP,verifyCompanyEmail, sendOTP,forgotPassword, resetPassword, resendOTP , getAllProfiles, getProfileById, getProfileByEmail, updateProfileById, followUser, unfollowUser, getNotifications} = require('../controllers/UserController');

const jwtMiddleware = require('../middleware/jwtMiddleware'); 

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-otp', verifyOTP);
router.post('/verifyCompanyEmail', verifyCompanyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword); 
router.post('/resend-otp', resendOTP);
router.post('/sendOTP',sendOTP)
router.get('/profile/:id',jwtMiddleware, getProfileById);
router.get('/profile/email/:email', jwtMiddleware,  getProfileByEmail);
router.get('/profiles', jwtMiddleware, getAllProfiles);
router.put('/profile/:id', jwtMiddleware, updateProfileById);
router.post('/follow/:id',jwtMiddleware, followUser);
router.post('/unfollow/:id',jwtMiddleware, unfollowUser);
router.get('/notifications/:userId',jwtMiddleware, getNotifications);

module.exports = router;
