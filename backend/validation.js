const { body } = require('express-validator');
const db = require("./database.js");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const MIN_PASSWORD_LEN = 8;
const { httpCodes } = require('./utils.js');
const PROJ_TITLE_MAX_LEN = 40;
const TITLE_MAX_LEN = 100;
const DESC_MAX_LEN = 500;
const loginValidators = [
        body("email")
        .trim()
        .notEmpty().withMessage('Email is required.').bail()
        .isEmail().withMessage("Email is not valid.").bail()
        .custom(async val => {
            const emailExists = await db.user.findUnique({
                where : {email : val}
            });
            if (!emailExists) {
                throw new Error(`${val} is not registered`);
            }
            return true;
        }).toLowerCase(),
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
const checkValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(httpCodes.BAD_REQUEST).json({
            errors
        });
    }
    next();
}

//middleware provides validation constraints and a check
module.exports = {
    registerIsValid : [
        body("email")
        .trim()
        .notEmpty().withMessage('Email is required').bail()
        .isEmail().withMessage((val) => `${val} is not valid`).bail()
        .custom(async (val) => {
            const emailTaken = await db.user.findUnique({
                where: { email: val }
            });
            console.log("emailTaken: ", emailTaken);
            if (emailTaken !== null) {
                throw new Error(`Email:${val} is already in use`);
            }
            return true;
        }).withMessage((val) => `${val} is already registered`).toLowerCase(),
        body("password").isLength({min: MIN_PASSWORD_LEN}).withMessage(`Password must be at least ${MIN_PASSWORD_LEN} characters.`),
        body("confirmPassword").custom((val, {req}) => val === req.body.password).withMessage("Passwords do not match"),
        checkValidation
    ],
    loginIsValid: [validateInSeries(loginValidators), checkValidation],
    taskIsValid: [
        body('title').trim().notEmpty().withMessage("Title cannot be empty").bail()
        .isLength({max: TITLE_MAX_LEN}).withMessage(`Title must be at most ${TITLE_MAX_LEN} characters`),
        body('description').trim().isLength({max: DESC_MAX_LEN}).withMessage(`Description must be at most ${DESC_MAX_LEN} characters`),
        checkValidation
    ],
    projectIsValid: [
        body('title').trim().notEmpty().withMessage('Project must have a title').bail()
        .isLength({max: PROJ_TITLE_MAX_LEN}),
        checkValidation
    ],
    invitationIsValid: [
        body('email').trim().notEmpty().withMessage('Email field cannot be empty').bail()
        .custom(async (email, {req}) => { 
            //check email exists in database
            //also check email doesn't belong to the user performing invite
            const userEmail = await db.user.findUnique({
                where : {
                    email: email,
                    NOT : {
                       id: req.session.userId
                    }
                }
            });
            if (!userEmail) {
                throw new Error('Email must exist and not belong to the inviter.')
            }
            req.inviteeId = userEmail.id;
            req.inviteeEmail = email;
            //check user not already invited...
            return true
        }),
        body('role').custom(val => {
            if (val !== 'EDIT' && val !== 'VIEW') {
                throw new Error("Role must be Edit or View");
            }
            return true
        }),
        checkValidation
    ]
}