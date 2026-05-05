const express = require("express");
const path = require("path");
const app = express();
const session = require('express-session')
const index = path.join(__dirname, "..", "frontend", "dist");
require('dotenv').config({path: path.join(__dirname, ".env")});
const validation = require(path.join(__dirname, "validation.js"));
const db = require(path.join(__dirname, "database.js"));
bcrypt = require("bcrypt");
const {validationResult, matchedData} = require('express-validator');
const PORT = 3000;
const SALT_ROUNDS = 10;
const httpCodes = require(path.join(__dirname, 'httpCodes.js'));

//serve react files 
app.use('/', express.static(index));
//parse json from request body
app.use(express.json());
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
}));

app.post('/api/register', 
    validation.registerIsValid,
    async (req, res) => {
        //validate data:
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(httpCodes.BAD_REQUEST).json({
                success: false,
                message: "Validation Failed",
                errors: errors.array()
            })
        }
        //register user in the database
        const data = matchedData(req);
        const hash = await bcrypt.hash(data.password, SALT_ROUNDS);
        const createdUser = await db.user.create({
            data : {
                email: data.email,
                hash : hash
            }
        })
        console.log(createdUser);
        return res.json({
            success : true
        });
    }
);

app.post('/api/login', 
    validation.loginIsValid,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(httpCodes.BAD_REQUEST).res.json({
                user : null,
                errors: errors.array()
            });
        } else {
            const userInfo = matchedData(req);
            const userObj = await db.user.findUnique({
                where : {email : userInfo.email}
            });
            req.session.regenerate((err) => {
                req.session.userId = userObj.id;
                res.json({ user : userObj });
            });
        }
    }
);

app.get('/api/me', async (req, res) => { 
    if (req.
        session.userId) {
        const user = await db.user.findUnique({
            where : { id : req.session.userId}
        });
        return res.json({user: user})
    }
     return res.status(httpCodes.BAD_REQUEST).json({user : null});
});

app.post('/api/logout', async (req, res) => {
    if (req.session.userId) {
        req.session.destroy();
    }
    return res.json({user : null});
});


app.listen(PORT);
