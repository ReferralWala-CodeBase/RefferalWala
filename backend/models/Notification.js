const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'JobPost', required: true },
  createdAt: { type: Date, default: Date.now, expires: '3d' } // TTL index
});

const Notification = mongoose.model('Notification', NotificationSchema);
module.exports = Notification;
