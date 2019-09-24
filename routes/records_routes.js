const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const recordsController = require('./controllers/records_controller');

router.use(bodyParser.json());

router.post('',recordsController.submit);

module.exports = router;