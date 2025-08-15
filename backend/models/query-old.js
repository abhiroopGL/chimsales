const mongoose = require('mongoose');

const querySchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String },
  address: { type: String },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: {
    type: String, 
    enum: ['Pending', 'In Process', 'Resolved'], 
    default: 'Pending' 
  },
}, { timestamps: true });

module.exports = mongoose.model('Query', querySchema);
