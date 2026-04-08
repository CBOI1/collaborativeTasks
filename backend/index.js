const express = require("express");
const path = require("path");
const app = express();
const index = path.join(__dirname, "..", "frontend", "dist");
//serve react files 
app.use('/', express.static(index));
//parse json from request body
app.use(express.json());
app.post('/api/register', (req, res, next) => {
    console.log(req.body);
    //validate data
    //register user in the database
    res.redirect('/');
});

const PORT = 3000;
app.listen(PORT);

