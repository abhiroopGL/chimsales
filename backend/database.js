const mongoose = require('mongoose');

const connectDatabase = (MONGODB_URL) => {
  mongoose.connect(MONGODB_URL)
}

module.exports = { connectDatabase }