const mongoose = require('mongoose');

const model = mongoose.model('User', {
  _id: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
    required: true,
  },
});

module.exports = model;