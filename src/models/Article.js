const mongoose = require('mongoose');


const model = mongoose.model('Article', {
  _id: {
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
  title: {
    type: String,
    required: true,
  },
  deltaContent: {
    type: Object,
    required: true,
  },
  rawContent: {
    type: String,
    required: true,
  },
  commentCount: {
    type: Number,
    required: true,
  },
});

module.exports = model;