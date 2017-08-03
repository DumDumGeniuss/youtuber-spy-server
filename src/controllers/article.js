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
  const dateNow = new Date();

  youtubeApi.getUserInfo(query.access_token)
    .then((result) => {
      if (!result) {
        return Promise.reject({
          status: 403,
          message: 'Your token is not valid',
        });
      }
      const newArticle = new Article({
        _id: mongoose.Types.ObjectId(),
        userId: result.id,
        userName: result.name,
        userPicture: result.picture,
        createdAt: dateNow,
        updatedAt: dateNow,
        title: article.title,
        rawContent: article.rawContent,
        deltaContent: article.deltaContent,
        commentCount: 0,
      });
      return newArticle.save();
    })
    .then(() => {
      res.json({
        status: 200,
        message: 'successfully create article',
      });
    })
    .catch((err) => {
      console.log(err);
      if (err.status) {
        res.status(err.status).json(err);
      } else  {
        res.status(500).json(err);
      }
    });
};

exports.updateArticle = (req, res) => {
  const query = req.query;
  const articleId = req.params.id;
  const article = req.body;
  const dateNow = new Date();
  let articleUserId = '';

  Article.findById(articleId)
    .then((article) => {
      if (!article) {
        return Promise.reject({
          status: 404,
          message: 'This update not exist',
        });
      }
      articleUserId = article.userId;
      return youtubeApi.getUserInfo(query.access_token)
    })
    .then((result) => {
      if (!result) {
        return Promise.reject({
          status: 403,
          message: 'Your token is not valid',
        });
      }

      if (articleUserId !== result.id) {
        return Promise.reject({
          status: 403,
          message: 'You\'re not allowed to update this article',
        });
      }
      const updateArticle = {};
      if (article.title) {
        updateArticle.title = article.title;
      }
      if (article.rawContent && article.deltaContent) {
        updateArticle.rawContent = article.rawContent;
        updateArticle.deltaContent = article.deltaContent;
      }
      return Article.updateOne({ _id: articleId }, updateArticle, {});
    })
    .then((result) => {
      res.json({
        status: 200,
        message: 'successfully update article with id ' + articleId,
      });
    })
    .catch((err) => {
      console.log(err);
      if (err.status) {
        res.status(err.status).json(err);
      } else  {
        res.status(500).json(err);
      }
    });
};
