const User = require('../models/User.js');
const youtubeApi = require('../libs/youtubeApi');

exports.addUser = (req, res) => {
  const query = req.query;
  const body = req.body;
  if (!query.access_token) {
    res.status(500).send({
      message: 'No token found'
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

      const newUser = new User({
        _id: result.id,
        email: result.email,
        link: result.link,
        name: result.name,
        picture: result.picture,
      });

      return User.update({_id: newUser._id}, newUser, {upsert: true});
    })
    .then(() => {
      res.status(200).json({
        message: 'successfully create user'
      });
    })
    .catch((err) => {
      if (err.status) {
        res.status(err.status).json(err);
      } else {
        res.status(500).json(err);
      }
    });
};
