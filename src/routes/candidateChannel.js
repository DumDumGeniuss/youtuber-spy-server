const express = require('express');
const candidateChannelController = require('../controllers/candidateChannel.js');

const router = express.Router();

/**
* Set all routes here
*/
router.get('/', candidateChannelController.getCandidateChannels);
router.post('/', candidateChannelController.addCandidateChannel);

module.exports = router;
