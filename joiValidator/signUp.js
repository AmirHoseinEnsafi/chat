const Joi = require('joi')
const passwordComplexity = require('joi-password-complexity')

const passCom = {
    min : 8 ,
    max : 32 ,
    lowerCase : 1 ,
    upperCase : 1 ,
    numeric : 1 ,
    symbol : 1 ,
    requirementCount : 3
}

const validate = Joi.object({
    userName : Joi.string().min(3).max(20).required() ,
    name : Joi.string().min(3).max(20).required() ,
    lastName : Joi.string().min(3).max(20).required() ,
    email : Joi.string().email().required() ,
    number : Joi.string().min(11).max(14).required(),
    password : passwordComplexity(passCom).required()
})

module.exports = validate