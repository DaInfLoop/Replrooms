const mongoose = require('../index.js')
const User = require('./User')

const Message = new mongoose.Schema({
  content: String,
  author: User.schema
});

module.exports = mongoose.model('Message', Message)