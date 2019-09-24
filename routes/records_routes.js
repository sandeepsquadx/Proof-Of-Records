const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const recordsController = require('./controllers/records_controller');
const { validateHash, validateRecord, schemas } = require('../utils/validate');

router.use(bodyParser.json());

router.post('',validateHash(schemas.hashSchema), recordsController.submit);
router.post('/verify', validateRecord(schemas.recordSchema), recordsController.getRecord);

module.exports = router;