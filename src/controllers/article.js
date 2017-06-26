const Article = require('../models/Article.js');
const youtubeApi = require('../libs/youtubeApi');
const tinyHelper = require('../libs/tinyHelper');
const mongoose = require('mongoose');

exports.getArticles = (req, res) => {
  let sort = req.query.sort || 'addTime';
  let order = req.query.order || 'desc';
  let page = parseInt(req.query.page || 1, 10);
  let count = parseInt(req.query.count || 100, 10);
  let keyword = req.query.keyword || '';

  const dbQuery = {
    title: { $regex: new RegExp(keyword, 'i'), $exists: true },
  };

  Promise.all(
    [Article.find(dbQuery).sort({ [sort]: order }).skip((page - 1)*count).limit(count), Article.count(dbQuery)]
  )
    .then((results) => {
      res.status(200).json({
        datas: results[0],
        totalCount: results[1],
        token: Math.random().toString(16).substring(2),
      });
    });
};

exports.getArticle = (req, res) => {
  let articleId = req.params.id;

  Article.findById(articleId)
    .then((result) => {
      if (!result) {
        return Promise.reject({
          status: 404,
          message: 'Resource Not Found',
        });
      }
      res.status(200).json({
        data: result,
        token: Math.random().toString(16).substring(2),
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

exports.addArticle = (req, res) => {
  const query = req.query;
  const article = req.body;
  const superUsers = process.env.SUPER_USERS.split(',');

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
      const newArticle = new Article();
      for (let key in article) {
        newArticle[key] = article[key];
      }
      newArticle._id = mongoose.Types.ObjectId();
      newArticle.addTime = new Date();
      return newArticle.save();
    })
    .then(() => {
      res.json({
        status: 200,
        message: 'successfully create channel',
      });
    })
    .catch((err) => {
      if (err.status) {
        res.status(err.status).json(err);
      } else  {
        res.status(500).json(err);
      }
    });
};
