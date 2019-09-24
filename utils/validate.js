const Joi = require('@hapi/joi');

module.exports = {

	validateHash : (schema) => {
		return(req,res,next) => {
			
			var result = Joi.validate(req.body, schema);

			if(result.error){
				return res.send({"status" : 400, "data" : null, "error" : result.error});
			}else{
				console.log("in next");
				next();
			}
		}
	},

	validateRecord : (schema) => {
		return(req,res,next) => {
			
			var result = Joi.validate(req.body, schema);

			if(result.error){
				return res.send({"status" : 400, "data" : null, "error" : result.error});
			}else{
				next();
			}
		}
	},

	
	schemas : {
		hashSchema : Joi.object().keys({
			data : Joi.string().regex(/^[A-Fa-f0-9]{64}$/).required()
		}), 

		recordSchema : Joi.object().keys({
			dochash : Joi.string().regex(/^[A-Fa-f0-9]{64}$/).required(),
			txnhash : Joi.string().regex(/^^0x([A-Fa-f0-9]{64})$/).required(),
		})
	}
}


