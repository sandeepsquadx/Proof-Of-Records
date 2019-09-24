const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const recordSchema = new Schema({

	docHash : {
		type : String,
		required : true
	},
	txnHash : {
		type : String,
		required : true
	},
	createAt: {
        type: Date,
        default: Date.now()
    }

})

module.exports = mongoose.model('Record', recordSchema);