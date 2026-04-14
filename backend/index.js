const express = require("express");
const path = require("path");
const app = express();
const index = path.join(__dirname, "..", "frontend", "dist");
require('dotenv').config({path: path.join(__dirname, ".env")});
const validation = require(path.join(__dirname, "validation.js"));
const db = require(path.join(__dirname, "database.js"));
const {validationResult, matchedData} = require('express-validator');
const PORT = 3000;


//serve react files 
app.use('/', express.static(index));
//parse json from request body
app.use(express.json());

app.post('/api/register', 
    validation.registerIsValid,
    async (req, res) => {
        console.log(req.body);
        //validate data:
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "Validation Failed",
                errors: errors.array()
            })
            
        }
        //register user in the database
        const data = matchedData(req);
        const createdUser = await db.user.create({
            data : {
                email: data.email,
                hash: data.password
            }
        })
        console.log(createdUser);
        return res.json({
            success : true
        });
    }
);


app.listen(PORT);

