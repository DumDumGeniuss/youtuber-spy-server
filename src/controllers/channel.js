const Channel = require('../models/Channel.js');
const Category = require('../models/Category.js');

exports.getChannels = async function (req, res) {
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

  const results = await Promise.all(
    [
      Channel.find(dbQuery).sort({ [sort]: order }).skip((page - 1)*count).limit(count),
      Channel.count(dbQuery),
      Category.findById('channelCategory'),
      Category.findById('countryCategory'),
    ]
  );

  res.status(200).json({
    datas: results[0],
    totalCount: results[1],
    channelCategories: results[2].categories,
    countryCategories: results[3].categories,
    token: Math.random().toString(16).substring(2),
  });

};

exports.getChannel = async function (req, res) {
  let channelId = req.params.id;
  const query = req.query;

  if (query.random) {
    const channelCount = await Channel.count({});
    let randomSkip = parseInt(Math.random() * channelCount, 10);

    const channels = await Channel.find({}).skip(randomSkip).limit(1);
    if (!channels[0]) {
      res.status(404).json({
        message: 'no channel found',
      });
      return;
    }
    res.status(200).json({
      data: channels[0],
      token: Math.random().toString(16).substring(2),
    });
  } else {
    const channel = await Channel.findById(channelId);
    if (!channel) {
      res.status(404).json({
        message: 'no channel found',
      }); 
      return;
    }
    res.status(200).json({
      data: channel,
      token: Math.random().toString(16).substring(2),
    });
  }
};

exports.addChannel = async function (req, res) {
  const channel = req.body;
  if (!channel._id) {
    res.status(500).send('New channel must have _id parameters');
    return;
  }
  try {
    await Channel.update({_id: channel._id}, channel, {upsert: true});

    res.status(200).send('successfully create channel');
  } catch (err) {
    res.status(500).send(err);
  }
};
