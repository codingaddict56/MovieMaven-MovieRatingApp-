const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    password: {
      type: String,
      // required: true,
      minlength: 6,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    profilePicture: {
      type: String
    },
    googleId: {
      type: String,
      sparse: true
    },
    userTypeId: {
      type: Number
    }
  }, {
    timestamps: true,
  });

const User = mongoose.model('User', userSchema);

module.exports = User;