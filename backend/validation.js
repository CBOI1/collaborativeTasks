const { body } = require('express-validator');
const db = require("./database.js");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const MIN_PASSWORD_LEN = 8;
const loginValidators = [
        body("email")
        .trim()
        .isEmail().withMessage("Email is not valid.")
        .bail()
        .custom(async val => {
            const emailExists = await db.user.findUnique({
                where : {email : val}
            });
            if (!emailExists) {
                throw new Error(`Email:${val} is not registered`);
            }
            return true;
        }),
        body('password')
        .isLength({min: MIN_PASSWORD_LEN}).withMessage("Password must be at least 8 characters")
        .bail()
        .custom(async (val, { req } ) => {
            const currUser = (await db.user.findUnique({
                where : {email : req.body.email}
            }));
            const passwordMatched = await bcrypt.compare(val, currUser.hash);
            if (!passwordMatched) {
                throw new Error("Password is incorrect.");
            }
            return true;
        })
    ];

const validateInSeries = validations => {
    return async (req, res, next) => {
        for (let validation of validations) {
            const result = await validation.run(req);
            if (result.errors.length) break;
        }
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }
        res.status(400).json({ errors: errors.array() });
    }
}

module.exports = {
    registerIsValid : [
        body("email")
        .trim()
        .isEmail()
        .custom(async (val) => {
            const emailTaken = await db.user.findUnique({
                where: { email: val }
            });
            console.log("emailTaken: ", emailTaken);
            if (emailTaken !== null) {
                throw new Error(`Email:${val} is already in use`);
            }
            return true;
        }),
        body("password").isLength({min: MIN_PASSWORD_LEN}),
        body("confirmPassword").custom((val, {req}) => val === req.body.password)
    ],
    loginIsValid: validateInSeries(loginValidators)
}