const {body} = require('express-validator')

/*
Reference : https://www.npmjs.com/package/bcrypt
*/
const customerSignUpRule = [
    body('email').isEmail().withMessage('is not valid.'), //username should be email
    body('password') // password policy
        .isLength({min: 8}).withMessage('must be at least 8 characters long.') // length
        .matches(/\d/).withMessage('must contain a number.') //check if contain a number
        //check if contain a alphabet
        .matches(/[^a-zA-Z]/).withMessage('must At least one alphabet character (upper or lower case A-Z).')
];

//validate password policy for vendor
const vendorSignUpRule = [
    body('password')
        .isLength({min: 8}).withMessage('must be at least 8 characters long.')
        .matches(/\d/).withMessage('must contain a number.')
        .matches(/[^a-zA-Z]/).withMessage('must At least one alphabet character (upper or lower case A-Z).')
];


module.exports = {

    customerSignUpRule,vendorSignUpRule
};
