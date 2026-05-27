const { body } = require('express-validator');
const db = require("./database.js");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const MIN_PASSWORD_LEN = 8;
const httpCodes = require('./httpCodes.js')
const TITLE_MAX_LEN = 100;
const DESC_MAX_LEN = 500;
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
                throw new Error(`${val} is not registered`);
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
                throw new Error("Password is incorrect");
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
        res.status(httpCodes.BAD_REQUEST).json({ errors: errors.array() });
    }
}

module.exports = {
    registerIsValid : [
        body("email")
        .trim()
        .isEmail().withMessage((val) => `${val} is not valid`)
        .bail()
        .custom(async (val) => {
            const emailTaken = await db.user.findUnique({
                where: { email: val }
            });
            console.log("emailTaken: ", emailTaken);
            if (emailTaken !== null) {
                throw new Error(`Email:${val} is already in use`);
            }
            return true;
        }).withMessage((val) => `${val} is already registered`),
        body("password").isLength({min: MIN_PASSWORD_LEN}).withMessage(`Password must be at least ${MIN_PASSWORD_LEN} characters.`),
        body("confirmPassword").custom((val, {req}) => val === req.body.password).withMessage("Passwords do not match")
    ],
    loginIsValid: validateInSeries(loginValidators),
    taskIsValid: [
        body('title').trim().isLength({max: TITLE_MAX_LEN}).withMessage(`Title must be at most ${TITLE_MAX_LEN} characters`),
        body('description').trim().isLength({max: DESC_MAX_LEN}).withMessage(`Description must be at most ${DESC_MAX_LEN} characters`)
    ]
}