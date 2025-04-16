const mongoose = require('mongoose');

const connectDatabase = (MONGODB_URL) => {
  return mongoose.connect(MONGODB_URL)
}

module.exports = { connectDatabase }