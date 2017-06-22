const CandidateChannel = require('../models/CandidateChannel.js');
const Channel = require('../models/Channel.js');
const youtubeApi = require('../libs/youtubeApi');

exports.getCandidateChannels = (req, res) => {
  let sort = req.query.sort || 'subscriberCount';
  let order = req.query.order || 'desc';
  let page = parseInt(req.query.page || 1, 10);
  let count = parseInt(req.query.count || 100, 10);
  let keyword = req.query.keyword || '';

  const dbQuery = {
    title: { $regex: new RegExp(keyword, 'i'), $exists: true },
  };

  Promise.all(
    [CandidateChannel.find(dbQuery).sort({ [sort]: order }).skip((page - 1)*count).limit(count), CandidateChannel.count(dbQuery)]
  )
    .then((results) => {
      res.status(200).json({
        datas: results[0],
        totalCount: results[1],
        token: Math.random().toString(16).substring(2),
      });
    });

};

exports.addCandidateChannel = (req, res) => {
  const query = req.query;
  const body = req.body;
  const newCandidateChannel = {};
  let channelId;
  youtubeApi.getUserInfo(query.access_token)
    .then((result) => {
      if (!result) {
        return Promise.reject({
          status: 403,
          message: 'Your token is not valid',
        });
      }
      newCandidateChannel.addTime = new Date();
      newCandidateChannel.userId = result.id;
      newCandidateChannel.userName = result.name;
      newCandidateChannel.userPicture = result.picture;
      newCandidateChannel.isVerified = false;

      return youtubeApi.getYoutubeChannelId(body.link);
    })
    .then((result) => {
      if (!result) {
        return Promise.reject({
          status: 404,
          message: 'The link is not youtube channel link',
        });
      }
      channelId = result;
      /* If it already in Channel list ? */
      return Channel.find({_id: channelId});
    })
    .then((result) => {
      if (!result) {
        return Promise.reject({
          status: 403,
          message: 'The channel has already in channel list',
        });
      }
      return youtubeApi.getChannelInfo([channelId], process.env.YOUTUBE_APP_KEY);
    })
    .then((result) => {
      if (!result) {
        return Promise.reject({
          status: 404,
          message: 'Wrong channle Id',
        });
      }
      const channel = result;
      newCandidateChannel._id = channelId;
      newCandidateChannel.link = body.link || '';
      newCandidateChannel.userDescription = body.userDescription || '';
      newCandidateChannel.title = channel.snippet.title;
      newCandidateChannel.description = channel.snippet.description || '';
      newCandidateChannel.defaultThumbnails = channel.snippet.thumbnails.default.url;
      newCandidateChannel.viewCount = channel.statistics.viewCount;
      newCandidateChannel.commentCount = channel.statistics.commentCount;
      newCandidateChannel.subscriberCount = channel.statistics.subscriberCount;
      newCandidateChannel.videoCount = channel.statistics.videoCount;
      
      return new CandidateChannel(newCandidateChannel).save();
    })
    .then((result) => {
      res.status(200).json({
        message: 'success',
        data: result,
      });
    })
    .catch((err) => {
      console.log(err);
      if (err.status) {
        res.status(err.status).json(err);
      } else if (err.code) {
        if (err.code == 11000) {
          res.status(409).json({
            message: 'alrady in CandidateChannel',
          });
        }
      }
    });
  // res.status(200).json({ hey: 'addChannel' });
};

exports.updateCandidateChannel = (req, res) => {
  const query = req.query;
  const channelId = req.params.id;
  const body = req.body;
  const superUsers = process.env.SUPER_USERS.split(',');
  if (!query.action) {
    res.status(500).json({
      message: 'no action found',
    });
    return;
  }

  youtubeApi.getUserInfo(query.access_token)
    .then((result) => {
      if (!result) {
        return Promise.reject({
          status: 403,
          message: 'Your token is not valid',
        });
      }
      if (superUsers.indexOf(result.id) < 0) {
        return Promise.reject({
          status: 403,
          message: 'Your are not super user',
        });
      }
      const newChannel = new Channel({
        _id: channelId,
      });
      return newChannel.save();
    })
    .then(() => {
      return CandidateChannel.update({ _id: channelId }, { isVerified: true });
    })
    .then((result) => {
      res.status(200).json({
        message: 'success',
        data: result,
      });
    })
    .catch((err) => {
      if (err.status) {
        res.status(err.status).json(err);
      } else if (err.code) {
        res.status(500).json(err);
      }
    });
  // res.status(200).json({ hey: 'addChannel' });
};
