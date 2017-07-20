const express = require('express');
const channelStatisticController = require('../controllers/channelStatistic.js');

const router = express.Router();

/**
* Set all routes here
*/
router.get('/', channelStatisticController.getChannelStatistics);
// router.get('/:id', playerController.getPlayer);
// router.put('/:id', playerController.updatePlayer);
// router.delete('/:id', playerController.deletePlayer);

module.exports = router;
