const Joi = require('@hapi/joi');

const signupSchema = Joi.object({
    name: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().min(4).required(),
    email: Joi.string().email({
        tlds: {
            allow: false
        }
    }).required()
})

const loginSchema = Joi.object({
    password: Joi.string().min(4).required(),
    email: Joi.string().email({
        tlds: {
            allow: false
        }
    }).required()
})

signup = (data) => {
    return signupSchema.validate(data);
}

login = (data) => {
    return loginSchema.validate(data)
}

module.exports = {
    signup: signup,
    login: login
}