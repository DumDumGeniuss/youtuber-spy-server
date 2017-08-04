const Article = require('../models/Article.js');
const youtubeApi = require('../libs/youtubeApi');
const tinyHelper = require('../libs/tinyHelper');
const mongoose = require('mongoose');

exports.getArticles = (req, res) => {
  let sort = req.query.sort || 'createdAt';
  let order = req.query.order || 'desc';
  let count = parseInt(req.query.count || 100, 10);
  let keyword = req.query.keyword || '';
  let startTime = req.query.startTime || '1970-01-01';
  let endTime = req.query.endTime || '2100-12-31';

  const dbQuery = {
    createdAt: {
      '$gt': new Date(startTime),
      '$lt':  new Date(endTime)
    },
  };
  if (dbQuery) {
    dbQuery.title = { $regex: new RegExp(keyword, 'i'), $exists: true };
  }

  Promise.all(
    [Article.find(dbQuery).sort({ [sort]: order }).limit(count), Article.count(dbQuery)]
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
          message: 'Article Not Found',
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

  if (!article.title || article.title.lenght > 30) {
    res.status(411).json({
      message: 'Title too short or too long',
    });
    return;
  }


  if (!article.rawContent || article.rawContent.lenght < 30 || article.rawContent.lenght > 1500) {
    res.status(411).json({
      message: 'Content too short or too long',
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
      const updateArticle = {
        updatedAt: new Date(),
      };
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

exports.deleteArticle = (req, res) => {
  const query = req.query;
  const articleId = req.params.id;
  let articleUserId = '';

  Article.findById(articleId)
    .then((article) => {
      if (!article) {
        return Promise.reject({
          status: 404,
          message: 'This article not exist',
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
          message: 'You\'re not allowed to delete this article',
        });
      }

      return Article.deleteOne({ _id: articleId });
    })
    .then((result) => {
      res.status(200).json({
        message: 'success',
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
