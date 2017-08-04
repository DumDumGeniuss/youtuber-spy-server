const Comment = require('../models/Comment.js');
const Article = require('../models/Article.js');
const youtubeApi = require('../libs/youtubeApi');
const tinyHelper = require('../libs/tinyHelper');
const mongoose = require('mongoose');

exports.getComments = (req, res) => {
  let sort = req.query.sort || 'createdAt';
  let order = req.query.order || 'desc';
  let count = parseInt(req.query.count || 100, 10);
  let startTime = req.query.startTime || '1970-01-01';
  let endTime = req.query.endTime || '2100-12-31';
  let articleId = req.query.articleId || '';

  if (!articleId) {
    res.status(404).json({
      message: 'no articleId found',
    });
    return;
  }

  const dbQuery = {
    createdAt: {
      '$gt': new Date(startTime),
      '$lt':  new Date(endTime)
    },
    articleId: articleId,
  };

  Promise.all(
    [Comment.find(dbQuery).sort({ [sort]: order }).limit(count), Comment.count(dbQuery)]
  )
    .then((results) => {
      res.status(200).json({
        datas: results[0],
        totalCount: results[1],
        token: Math.random().toString(16).substring(2),
      });
    });
};

exports.addComment = (req, res) => {
  const query = req.query;
  const comment = req.body;
  const dateNow = new Date();
  const articleId =comment.articleId;
  let articleCommentCount;

  if (!comment.content || comment.content.length > 200) {
    res.status(411).json({
      message: 'Content too short or too long',
    });
    return;
  }

  Article.findById(articleId)
    .then((article) => {
      if (!article) {
        return Promise.reject({
          status: 404,
          message: 'The article you want to comment not exist',
        });
      }
      articleCommentCount = article.commentCount || 0;
      return youtubeApi.getUserInfo(query.access_token);
    })
    .then((result) => {
      if (!result) {
        return Promise.reject({
          status: 403,
          message: 'Your token is not valid',
        });
      }
      const newComment = new Comment({
        _id: mongoose.Types.ObjectId(),
        articleId: articleId,
        content: comment.content,
        userId: result.id,
        userName: result.name,
        userPicture: result.picture,
        createdAt: dateNow,
        updatedAt: dateNow,
      });
      return newComment.save();
    })
    .then(() => {
      return Article.updateOne({ _id: articleId }, { commentCount: articleCommentCount + 1 }, {});
    })
    .then(() => {
      res.status(200).json({
        message: 'successfully create comment',
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

exports.deleteComment = (req, res) => {
  const query = req.query;
  const commentId = req.params.id;
  let commentUserId = '';

  Comment.findById(commentId)
    .then((comment) => {
      if (!comment) {
        return Promise.reject({
          status: 404,
          message: 'This comment not exist',
        });
      }
      commentUserId = comment.userId;
      return youtubeApi.getUserInfo(query.access_token)
    })
    .then((result) => {
      if (!result) {
        return Promise.reject({
          status: 403,
          message: 'Your token is not valid',
        });
      }

      if (commentUserId !== result.id) {
        return Promise.reject({
          status: 403,
          message: 'You\'re not allowed to delete this comment',
        });
      }

      return Comment.deleteOne({ _id: commentId });
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
};
