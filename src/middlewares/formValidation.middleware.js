const Joi = require('joi');

const email = Joi.string().email({ 
    minDomainSegments: 2, tlds: {allow: ['com','net']}
});


const newPassword = Joi.string().alphanum().min(3).max(30).required();

const pin = Joi.number().min(100000).max(999999).required();

const shortStr = Joi.string().min(2).max(50)

const longStr = Joi.string().min(2).max(1000);



const resetPassReqValidation = (req, res, next) => {
    const schema = Joi.object({ email });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ status: 'error', message: error.message });
    }    
    next();
};
const updatePassReqValidation = (req, res, next) => {
    const schema = Joi.object({ email, pin , newPassword });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ status: 'error', message: error.message });
    }    
    next();
};

const createNewTicketValidation = (req, res, next) => {
    const schema = Joi.object({
        subject: shortStr.required(),
        sender: shortStr.required(),
        message: longStr.required()
    })

    const value = schema.validate(req.body);
   
    console.log(value);
    if(value.error) {
        return  res.json({status: "error", message: value.error.message});       

    }
   next();
}
const replyTicketMessageValidation = (req, res, next) => {
    const schema = Joi.object({
        sender: shortStr.required(),
        message: longStr.required()
    })

    const value = schema.validate(req.body);
   
   
    if(value.error) {
        console.log(value.error);
        return  res.json({status: "error", message: value.error.message});       

    }
   next();
}



module.exports= {
    resetPassReqValidation,
    updatePassReqValidation,
    createNewTicketValidation,
    replyTicketMessageValidation
}