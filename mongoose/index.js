const mongoose = require('mongoose');
const { connection } = mongoose;

mongoose.connect(`mongodb+srv://DaInfLoop:${process.env.MONGOPASS}@cluster0.omk0m.mongodb.net/replrooms?retryWrites=true&w=majority`)

connection.on('open', () => {
  console.log("Successfully launched Mongoose!")
})

module.exports = mongoose