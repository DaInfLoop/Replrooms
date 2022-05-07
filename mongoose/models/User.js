const mongoose = require('../index.js')

const User = new mongoose.Schema({
  username: String,
  _id: String,
  title: { type: String, default: "undefined" },
  pfp: String,
  banned: {
    type: Boolean,
    default: false
  },
  muted: {
    type: Boolean,
    default: false
  },
}, { _id: false });

module.exports = mongoose.model('User', User)
