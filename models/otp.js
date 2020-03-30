const mongoose = require('mongoose');

const OTPSchema = new mongoose.Schema({
  number: {
    type: String,
    requiredPaths: true,
    unique: true
  },
  otp: {
    type: String,
    required: true
  }
},
{
  timestamps: true
});

module.exports = mongoose.model('otps', OTPSchema);