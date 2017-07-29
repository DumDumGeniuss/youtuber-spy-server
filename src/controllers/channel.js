const Channel = require('../models/Channel.js');
const Category = require('../models/Category.js');

exports.getChannels = (req, res) => {
  let sort = req.query.sort || 'subscriberCount';
  let order = req.query.order || 'desc';
  let page = parseInt(req.query.page || 1, 10);
  let count = parseInt(req.query.count || 4, 10);
  let keyword = req.query.keyword || '';
  let category = req.query.category || '';
  let country = req.query.country || '';

  const dbQuery = {
    title: { $regex: new RegExp(keyword, 'i'), $exists: true },
  };
  if (category) {
    dbQuery.category = category;
  }
  if (country) {
    dbQuery.country = country;
  }

  Promise.all(
    [
      Channel.find(dbQuery).sort({ [sort]: order }).skip((page - 1)*count).limit(count),
      Channel.count(dbQuery),
      Category.findById('channelCategory'),
      Category.findById('countryCategory'),
    ]
  )
    .then((results) => {
      res.status(200).json({
        datas: results[0],
        totalCount: results[1],
        channelCategories: results[2].categories,
        countryCategories: results[3].categories,
        token: Math.random().toString(16).substring(2),
      });
    });
};

exports.getChannel = (req, res) => {
  let channelId = req.params.id;
  const query = req.query;

  if (query.random) {
    Channel.count({})
      .then((result) => {
        let randomSkip = parseInt(Math.random() * result, 10);
        return Channel.find({}).skip(randomSkip).limit(1);
      })
      .then((result) => {
        res.status(200).json({
          data: result[0],
          token: Math.random().toString(16).substring(2),
        });
      })
  } else {
    Channel.findById(channelId)
      .then((result) => {
        res.status(200).json({
          data: result,
          token: Math.random().toString(16).substring(2),
        });
      });
  }
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
