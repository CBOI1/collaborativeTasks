const express = require('express');
const path = require('path');
const db = require(path.join(__dirname, '../database.js'));
const {registerIsValid, loginIsValid} = require(path.join(__dirname, "../validation.js"));
const bcrypt = require("bcrypt");
const {validationResult, matchedData} = require('express-validator');
const {httpCodes} = require(path.join(__dirname, '..', 'utils'));
const SALT_ROUNDS = 10;
const RECORD_LIMIT = 10;
const { isAuthenticated } = require('../utils');

const userRoutes = express.Router();

userRoutes.get('/search', isAuthenticated, async (req, res) => {
    const data = await db.user.findMany({
        where: {
            email : {
                startsWith: req.query.email.toLowerCase()
            },
            id: {
                not: req.session.userId
            }
        },
        select: {
            email : true,
            id: true
        },
        take: RECORD_LIMIT
    })
    return res.json(data);
});

userRoutes.post('/register', 
    registerIsValid,
    async (req, res) => {
        //register user in the database
        const data = matchedData(req);
        const hash = await bcrypt.hash(data.password, SALT_ROUNDS);
        const createdUser = await db.user.create({
            data : {
                email: data.email,
                hash : hash
            }
        });
        return res.json({
            success : true
        });
    }
);

userRoutes.post('/login', 
    loginIsValid,
    async (req, res) => {
        const userInfo = matchedData(req);
        const userObj = await db.user.findUnique({
            where : {email : userInfo.email}
        });
        return req.session.regenerate((err) => {
            req.session.userId = userObj.id;
            res.json({ user : userObj });
        });
    }
);

userRoutes.get('/me', async (req, res) => { 
    if (req.
        session.userId) {
        const user = await db.user.findUnique({
            where : { id : req.session.userId}
        });
        return res.json({user: user})
    }
     return res.status(httpCodes.BAD_REQUEST).json({user : null});
});

userRoutes.post('/logout', async (req, res) => {
    if (req.session.userId) {
        req.session.destroy();
    }
    return res.json({user : null});
});

module.exports = userRoutes;