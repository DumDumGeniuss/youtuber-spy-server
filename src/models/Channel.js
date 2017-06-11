const mongoose = require('mongoose');


const model = mongoose.model('Channel', {
  etag: {
    type: String,
  },
  _id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  publishedAt: {
    type: Date,
  },
  defaultThumbnails: {
    type: String,
  },
  mediumThumbnails: {
    type: String,
  },
  highThumbnails: {
    type: String,
  },
  viewCount: {
    type: Number,
  },
  commentCount: {
    type: Number,
  },
  subscriberCount: {
    type: Number,
  },
  videoCount: {
    type: Number,
  },
  randomNumber: {
    type: Number,
  },
});

module.exports = model;