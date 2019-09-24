const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const recordsController = require('./controllers/records_controller');
const { validateHash, validateRecord, schemas } = ('../utils/validate');

router.use(bodyParser.json());


router.post('', recordsController.submit);
router.post('/verify', recordsController.getRecord);

module.exports = router;