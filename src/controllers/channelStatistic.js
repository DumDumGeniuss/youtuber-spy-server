const ChannelStatistic = require('../models/ChannelStatistic.js');

exports.getChannelStatistics = (req, res) => {
  let sort = req.query.sort || 'createdAt';
  let order = req.query.order || 'desc';
  let page = parseInt(req.query.page || 1, 10);
  let count = parseInt(req.query.count || 30, 10);
  let startTime = req.query.startTime || '1970-01-01';
  let endTime = req.query.endTime || '2100-12-31';
  let channelId = req.query.channelId || '';

  const dbQuery = {
    createdAt: {
      '$gte': new Date(startTime),
      '$lte':  new Date(endTime)
    },
  };

  if (channelId) {
    dbQuery.channelId = channelId;
  }

  Promise.all(
    [ChannelStatistic.find(dbQuery).sort({ [sort]: order }).skip((page - 1)*count).limit(count), ChannelStatistic.count(dbQuery)]
  )
    .then((results) => {
      res.status(200).json({
        datas: results[0],
        totalCount: results[1],
        token: Math.random().toString(16).substring(2),
      });
    });
};
