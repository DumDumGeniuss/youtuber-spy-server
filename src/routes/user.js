const express = require('express');
const userController = require('../controllers/user.js');

const router = express.Router();

/**
* Set all routes here
*/
router.post('/', userController.addUser);

module.exports = router;
