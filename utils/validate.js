const Joi = require('@hapi/joi');

module.exports = {

	validateHash : (schema) => {
		return(req,res,next) => {
			
			var result = Joi.validate(req.body, schema);

			if(result.error){
				return res.send({"status" : 400, "data" : null, "error" : result.error});
			}else{
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
			docHash : Joi.string().regex(/^[A-Fa-f0-9]{64}$/).required()
		}), 

		recordSchema : Joi.object().keys({
			docHash : Joi.string().regex(/^[A-Fa-f0-9]{64}$/).required(),
			txnHash : Joi.string().regex(/^^0x([A-Fa-f0-9]{64})$/).required(),
		})
	}
}


