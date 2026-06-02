const express = require("express");
const path = require("path");
const db = require(path.join(__dirname, '../database.js'));
const { httpCodes, isAuthenticated } = require(path.join(__dirname, '..', 'utils'));
const projectRouter = express.Router();

//create a project for a specific user
projectRouter.post('/projects', isAuthenticated, async (req, res) => {
    const userId = req.session.userId;
    const projectRecord = await db.project.create({
        data: {
            title: req.body.title,
            ownerId : userId
        }
    });
    return res.json({
        project: projectRecord
    })
});

//read a specific user's projects
projectRouter.get('/projects', isAuthenticated, async (req, res) => {
    const projects = await db.project.findMany({
        where: {
            ownerId : req.session.userId
        }
    });
    return res.json({
        projects
    });
});

module.exports = projectRouter;