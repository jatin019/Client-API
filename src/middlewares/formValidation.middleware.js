const Joi = require('joi');

const email = Joi.string().email({ 
    minDomainSegments: 2, tlds: {allow: ['com','net']}
});

const newPassword = Joi.string().alphanum().min(3).max(30).required();

const pin = Joi.number().min(100000).max(999999).required();

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

module.exports= {
    resetPassReqValidation,
    updatePassReqValidation,
}