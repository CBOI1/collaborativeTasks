const express = require("express");
const path = require("path");
const app = express();
const session = require('express-session')
const index = path.join(__dirname, "..", "frontend", "dist");
require('dotenv').config({path: path.join(__dirname, ".env")});
const PORT = 3000;
const userRouter = require(path.join(__dirname, 'routes/user'));
const taskRouter = require(path.join(__dirname, 'routes/task'));
const projectRouter = require(path.join(__dirname, 'routes/project'));

//serve react files 
app.use(express.static(index));
//parse json from request body
app.use(express.json());
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
}));

app.use('/api', userRouter);
app.use('/api', taskRouter);
app.use('/api', projectRouter);

app.listen(PORT);
