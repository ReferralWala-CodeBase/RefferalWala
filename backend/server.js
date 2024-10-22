const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const passport = require('passport');

const connectDB = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const jobPostRoutes = require('./routes/jobPostRoutes');
const authRoutes = require('./routes/auth');
const cron = require('node-cron');
const Notification = require('./models/Notification');
dotenv.config();
require('./config/passport');


const app = express();
app.use(cors({
  origin: ['http://localhost:5000']
}));
app.use(express.json());

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


app.use('/user', userRoutes);
app.use('/job', jobPostRoutes);
app.use('/googleauth',authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
