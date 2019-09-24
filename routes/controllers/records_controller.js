const Web3 = require('web3');
var Buffer = require('buffer/').Buffer
const Tx = require('ethereumjs-tx');
const safecompare = require('safe-compare');

const Record = require('../../db/model/record');

const { successResponse, errorResponse, error } = require('../../utils/utils');



if(process.env.NODE_ENV == 'development') {
	var account = process.env.LOCAL_ACCOUNT;
	var contractAddress = process.env.LOCAL_CONTRACT_ADDRESS;   
	var privateKey = process.env.LOCAL_PVT_KEY;

	var web3 = new Web3(new Web3.providers.HttpProvider(process.env.LOCAL_WEB3_PROVIDER));	
}else{
	var account = process.env.PRODUCTION_ACCOUNT;
	var contractAddress = process.env.PRODUCTION_CONTRACT_ADDRESS;   
	var privateKey = process.env.PRODUCTION_PVT_KEY;
	var web3 = new Web3(new Web3.providers.HttpProvider(process.env.PRODUCTION_WEB3_PROVIDER));
}

const submit = (req,res,next) => {

	Record.findOne({ docHash : req.body.data})
	.then(record => {
		if(record == null) {
			return web3.eth.getTransactionCount(account);
		}else {
			getTransactionDetails(record,res);
		}
	})
	.then(nonce => {

		var dataToSend = req.body.data;

		const rawTx = {
  			nonce : nonce,
   			gasPrice: web3.utils.toHex(web3.utils.toWei('200', 'gwei')),
	    	gasLimit: 4700000,
	    	to: "0x2B535829D2fe401c57aAE4a581e128d6f15Cc464",
			value: 0,
			data: dataToSend
		}

		const tx = new Tx(rawTx);
		const privateKeyBuffer = new Buffer(privateKey,'hex');

		tx.sign(privateKeyBuffer);
		var raw = '0x' + tx.serialize().toString('hex');


		var promise = new Promise((resolve,reject) => {
			web3.eth.sendSignedTransaction(raw, (err,transactionHash) => {
				if(err) reject(err)
				resolve(transactionHash);	
			})
		})

		return promise;
	})
	.then(transactionHash => {
		if(transactionHash == null) {
			error.message = "Failed to record data to blockchain";
			throw error;
		}

		return Record.create({
			docHash : req.body.data,
			txnHash : transactionHash
		});
	})
	.then(record => {
		console.log(record);

		if(record == null) {
			error.message = "Failed to record data to DB";
			throw error;
		}
		res.send(successResponse(record));
	})
	.catch((err) => {
		console.log(err);

		res.send(errorResponse(err));
	})
}

const getRecord = (req,res,next) => {

	web3.eth.getTransaction(req.body.txnhash)
	.then(transaction => {
		if(transaction == null) {
			error.message = "Failed to find transaction details";
			throw error;
		}

		var hex = Buffer.from(req.body.dochash, 'utf8').toString('hex');
	
		hex = '0x' + hex;
		var isVerified = safecompare(hex,transaction.input)
	
		res.send(successResponse({
			transaction : transaction,
			input : {
				input : transaction.input,
				isVerified : isVerified
			}
		}));
	})
	.catch((err) => {
		console.log(err);
		res.send(errorResponse(err));
	})
}

function getTransactionDetails(record,res) {

	web3.eth.getTransaction(record.txnHash)
	.then(transaction => {
		if(transaction == null) {
			error.message = "Failed to find transaction details";
			throw error;
		}

		var hex = Buffer.from(record.docHash, 'utf8').toString('hex');
	
		hex = '0x' + hex;
		var isVerified = safecompare(hex,transaction.input);
		transaction.isVerified = isVerified;
	
		res.send(successResponse({
			record : record,
			transaction : transaction
		}))
	})
	.catch((err) => {
		console.log(err);
		res.send(errorResponse(err));
	})
}

module.exports = {
	submit,
	getRecord
}


