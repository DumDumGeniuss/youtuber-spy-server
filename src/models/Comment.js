const mongoose = require('mongoose');


const model = mongoose.model('Comment', {
  _id: {
    type: String,
    required: true,
  },
  articleId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  userPicture: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  updatedAt: {
    type: Date,
    required: true,
  },
  content: {
    type: Object,
    required: true,
  },
});

module.exports = model;