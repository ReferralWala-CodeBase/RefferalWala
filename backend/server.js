const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const passport = require('passport');

const connectDB = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const jobPostRoutes = require('./routes/jobPostRoutes');
const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contactRoutes');
const cron = require('node-cron');
const Notification = require('./models/Notification');
const jobReportRoutes = require('./routes/jobReport');
const locationRoutes = require('./routes/locationRoutes');
const rapidJobRoutes = require('./routes/rapidJobRoutes');
const rapidInternshipRoutes = require('./routes/rapidInternshipRoutes');
dotenv.config();
require('./config/passport');


const app = express();
app.use(cors({
  origin: ['http://localhost:3000', 'https://referralwala-deployment-frontend.vercel.app', 'https://referralwala.com','http://3.109.97.10' ]
}));

app.use(express.json({ limit: '10mb' }));

connectDB();

app.use(express.json());

app.use(passport.initialize());
cron.schedule('0 0 * * *', async () => {
    try {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      await Notification.deleteMany({ createdAt: { $lt: sevenDaysAgo } });
      console.log('Old notifications deleted successfully.');
    } catch (err) {
      console.error('Error deleting old notifications:', err.message);
    }
  });

app.get('/', (req, res) => {
    res.send('Server Running Successfully');
});
app.use('/user', userRoutes);
app.use('/job', jobPostRoutes);
app.use('/contact', contactRoutes);
app.use('/googleauth',authRoutes);
app.use('/job-reports', jobReportRoutes);
app.use('/locationlist',locationRoutes)
app.use('/rapidjob', rapidJobRoutes);
app.use('/rapidinternship',rapidInternshipRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
