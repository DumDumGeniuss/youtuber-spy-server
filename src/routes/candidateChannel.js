const express = require('express');
const candidateChannelController = require('../controllers/candidateChannel.js');

const router = express.Router();

/**
* Set all routes here
*/
router.get('/', candidateChannelController.getCandidateChannels);
router.post('/', candidateChannelController.addCandidateChannel);
router.put('/:id', candidateChannelController.updateCandidateChannel);
router.delete('/:id', candidateChannelController.deleteCandidateChannel);

module.exports = router;
