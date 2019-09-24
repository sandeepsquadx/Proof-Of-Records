const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
var compression = require('compression')

//initialise the app
let app = express();
dotenv.config();

var port = process.env.PORT || 3001;

app.use(compression())
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({limit:'50mb'}));

require('./routes')(app);

app.listen(port, () => {
	console.log('server started at ', port);
})


