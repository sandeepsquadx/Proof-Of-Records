const Web3 = require('web3');
var Buffer = require('buffer/').Buffer
const Tx = require('ethereumjs-tx');
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

	web3.eth.getTransactionCount(account)
	.then(nonce => {

		var dataToSend = req.body.data;

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
		res.send(transactionHash);
	})
	.catch((err) => {
		console.log(err);
		res.send(err);
	})

	
}


module.exports = {
	submit
}


