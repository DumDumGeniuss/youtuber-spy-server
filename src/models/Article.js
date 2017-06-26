const mongoose = require('mongoose');


const model = mongoose.model('Article', {
  _id: {
    type: String,
    required: true,
  },
  addTime: {
    type: Date,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  titleImage: {
    type: String,
    required: true,
  },
});

module.exports = model;