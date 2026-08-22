const express = require('express');
const multer = require('multer');
const asyncHandler = require('../middleware/asyncHandler');
const contactsController = require('../controllers/contactsController');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });
const router = express.Router();

router.get('/', asyncHandler(contactsController.list));
router.post('/', asyncHandler(contactsController.create));
router.post('/import', upload.single('file'), asyncHandler(contactsController.importCsv));
router.get('/:id', asyncHandler(contactsController.get));
router.put('/:id', asyncHandler(contactsController.update));
router.delete('/:id', asyncHandler(contactsController.remove));
router.get('/:id/career-history', asyncHandler(contactsController.listCareerHistory));
router.post('/:id/career-history', asyncHandler(contactsController.createCareerHistory));

module.exports = router;
