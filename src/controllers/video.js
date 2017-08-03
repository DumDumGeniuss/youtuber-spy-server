const Video = require('../models/Video.js');
const Category = require('../models/Category.js');

exports.getVideos = (req, res) => {
  let sort = req.query.sort || 'publishedAt';
  let order = req.query.order || 'desc';
  let page = parseInt(req.query.page || 1, 10);
  let count = parseInt(req.query.count || 30, 10);
  let startTime = req.query.startTime || '1970-01-01';
  let endTime = req.query.endTime || '2100-12-31';
  let keyword = req.query.keyword || '';
  let category = req.query.category || '';
  let channelId = req.query.channelId || '';

  const dbQuery = {
    title: { $regex: new RegExp(keyword, 'i'), $exists: true },
    publishedAt: {
      '$gte': new Date(startTime),
      '$lte':  new Date(endTime)
    },
  };
  if (category) {
    dbQuery.category = category;
  }

  if (channelId) {
    dbQuery.channelId = channelId;
  }

  let dbConnection;
  let videos = [];
  let totalCounts;

  if (req.query.random) {
    Video.count(dbQuery)
      .then((result) => {
        totalCounts = result;
        let randomSkip = parseInt(Math.random() * result, 10);
        randomSkip = randomSkip + count > result ? result - count : randomSkip;
        randomSkip = randomSkip < 0 ? 0 : randomSkip;
        return Video.find(dbQuery).skip(randomSkip).limit(count);
      })
      .then((result) => {
        res.status(200).json({
          datas: result,
          token: Math.random().toString(16).substring(2),
          totalCount: totalCounts,
        });
      })
  } else {
    Promise.all(
      [
        Video.find(dbQuery).sort({ [sort]: order }).skip((page - 1)*count).limit(count),
        Video.count(dbQuery),
        Category.findById('videoCategory'),
      ]
    )
      .then((results) => {
        res.status(200).json({
          datas: results[0],
          totalCount: results[1],
          videoCategories: results[2].categories,
          token: Math.random().toString(16).substring(2),
        });
      });
  }
};

exports.getVideo = (req, res) => {
  let videoId = req.params.id;
  const query = req.query;

  if (query.random) {
    Video.count({})
      .then((result) => {
        let randomSkip = parseInt(Math.random() * result, 10);
        return Video.find({}).skip(randomSkip).limit(1);
      })
      .then((result) => {
        if (!result[0]) {
          res.status(404).json({
            message: 'no video found',
          });
        } else {
          res.status(200).json({
            data: result[0],
            token: Math.random().toString(16).substring(2),
          });
        }
      })
  } else {
    Video.findById(videoId)
      .then((result) => {
        if (!result) {
          res.status(404).json({
            message: 'no video found',
          });
        } else {
          res.status(200).json({
            data: result,
            token: Math.random().toString(16).substring(2),
          });
        }
      });
  }
};
