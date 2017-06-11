const express = require('express');
const homeController = require('../controllers/home.js');

const router = express.Router();

/**
* Set all routes here
*/
router.get('/', homeController.checkApp);

module.exports = router;
