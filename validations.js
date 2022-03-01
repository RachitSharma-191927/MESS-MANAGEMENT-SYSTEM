const Joi=require('joi')
module.exports.dashboardSchema=Joi.object({
    name:Joi.string().required(),
    rollNo:Joi.number().required().min(0),
    department:Joi.string().required(),
    designation:Joi.string().required()
}).required()

module.exports.dashboardSignSchema=Joi.object({
    name:Joi.string().required(),
    father_name:Joi.string().required(),
    email:Joi.string().required(),
    dateOfbirth:Joi.date().required(),
    rollNo:Joi.number().required().min(0),
    mobileNo:Joi.number().required(),
    department:Joi.string().required(),
    designation:Joi.string().required(),
}).required()

