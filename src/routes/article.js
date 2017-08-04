const express = require('express');
const articleController = require('../controllers/article.js');

const router = express.Router();

/**
* Set all routes here
*/
router.get('/', articleController.getArticles);
router.get('/:id', articleController.getArticle);
router.put('/:id', articleController.updateArticle);
router.delete('/:id', articleController.deleteArticle);
router.post('/', articleController.addArticle);

module.exports = router;
