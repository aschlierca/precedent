const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const careerHistoryController = require('../controllers/careerHistoryController');

const router = express.Router();

router.put('/:id', asyncHandler(careerHistoryController.update));
router.delete('/:id', asyncHandler(careerHistoryController.remove));

module.exports = router;
