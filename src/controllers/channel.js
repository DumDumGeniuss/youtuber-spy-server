const Channel = require('../models/Channel.js');

exports.getChannels = (req, res) => {
  let sort = req.query.sort || 'subscriberCount';
  let order = req.query.order || 'desc';
  let page = parseInt(req.query.page || 1, 10);
  let count = parseInt(req.query.count || 100, 10);
  let keyword = req.query.keyword || '';

  const dbQuery = {
    title: { $regex: new RegExp(keyword, 'i'), $exists: true },
  };

  Promise.all(
    [Channel.find(dbQuery).sort({ [sort]: order }).skip((page - 1)*count).limit(count), Channel.count(dbQuery)]
  )
    .then((results) => {
      res.status(200).json({
        datas: results[0],
        totalCount: results[1],
        token: Math.random().toString(16).substring(2),
      });
    });
};

exports.addChannel = (req, res) => {
  const channel = req.body;
  if (!channel._id) {
    res.status(500).send('New channel must have _id parameters');
    return;
  }

  const newChannel = new Channel(channel);
  newChannel.save()
    .then(() => {
      res.status(200).send('successfully create channel');
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};
