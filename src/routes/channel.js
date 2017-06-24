const express = require('express');
const channelController = require('../controllers/channel.js');

const router = express.Router();

/**
* Set all routes here
*/
router.get('/', channelController.getChannels);
router.post('/', channelController.addChannel);
router.get('/:id', channelController.getChannel);
// router.put('/:id', playerController.updatePlayer);
// router.delete('/:id', playerController.deletePlayer);

module.exports = router;
