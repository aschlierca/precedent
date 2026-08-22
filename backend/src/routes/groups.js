const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const groupsController = require('../controllers/groupsController');
const insightController = require('../controllers/insightController');

const router = express.Router();

router.get('/', asyncHandler(groupsController.list));
router.post('/', asyncHandler(groupsController.create));
router.get('/:id', asyncHandler(groupsController.get));
router.put('/:id', asyncHandler(groupsController.update));
router.delete('/:id', asyncHandler(groupsController.remove));
router.post('/:id/contacts/:contactId', asyncHandler(groupsController.assignContact));
router.delete('/:id/contacts/:contactId', asyncHandler(groupsController.unassignContact));
router.get('/:id/insight', asyncHandler(insightController.get));
router.post('/:id/insight/generate', asyncHandler(insightController.generate));

module.exports = router;
