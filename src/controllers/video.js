const Video = require('../models/Video.js');

exports.getVideos = (req, res) => {
  let sort = req.query.sort || 'publishedAt';
  let order = req.query.order || 'desc';
  let page = parseInt(req.query.page || 1, 10);
  let count = parseInt(req.query.count || 30, 10);
  let startTime = req.query.startTime || '1970-01-01';
  let endTime = req.query.endTime || '2100-12-31';
  let keyword = req.query.keyword || '';

  const dbQuery = {
    title: { $regex: new RegExp(keyword, 'i'), $exists: true },
    publishedAt: {
      '$gte': new Date(startTime),
      '$lte':  new Date(endTime)
    },
  };

  let dbConnection;
  let videos = [];
  let totalCounts = []

  Promise.all(
    [Video.find(dbQuery).sort({ [sort]: order }).skip((page - 1)*count).limit(count), Video.count(dbQuery)]
  )
    .then((results) => {
      res.status(200).json({
        datas: results[0],
        totalCount: results[1],
        token: Math.random().toString(16).substring(2),
      });
    });
};
