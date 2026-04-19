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
const BAD_REQUEST_CODE = 400;

//serve react files 
app.use('/', express.static(index));
//parse json from request body
app.use(express.json());
app.use(session({
    secret: 1,
    resave: false,
    saveUninitialized: false,
}))

app.post('/api/register', 
    validation.registerIsValid,
    async (req, res) => {
        console.log(req.body);
        //validate data:
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(BAD_REQUEST_CODE).json({
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
            return res.status(BAD_REQUEST_CODE).res.json({
                success : false,
                errors: errors.array()
            })
        } else {
            const userData = matchedData(req)
            const user = await db.user.findUnique({
                where : {email : userData.email}
            })
            req.session.userId = user.id;
            return res.json({
                success : true
            })
        }
    }
);


app.listen(PORT);
