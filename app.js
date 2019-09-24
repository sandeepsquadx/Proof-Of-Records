const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const config = require('./config/config');
var compression = require('compression')
const mongoose = require('mongoose');

//initialise the app
let app = express();
dotenv.config();

var port = process.env.PORT || 3001;

app.use(compression())
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({limit:'50mb'}));

mongoose.connect(config.url, { useFindAndModify: false },(err,database) => {
	
	require('./routes')(app);

	app.listen(port, () => {
		console.log('server started at ', port);
	})
})


