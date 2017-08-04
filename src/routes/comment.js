const express = require('express');
const commentController = require('../controllers/comment.js');

const router = express.Router();

/**
* Set all routes here
*/
router.get('/', commentController.getComments);
router.delete('/:id', commentController.deleteComment);
router.post('/', commentController.addComment);

module.exports = router;
