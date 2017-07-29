const express = require('express');
const videoController = require('../controllers/video.js');

const router = express.Router();

/**
* Set all routes here
*/
router.get('/', videoController.getVideos);
router.get('/:id', videoController.getVideo);
// router.put('/:id', playerController.updatePlayer);
// router.delete('/:id', playerController.deletePlayer);

module.exports = router;
