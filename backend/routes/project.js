const express = require("express");
const { matchedData } = require("express-validator");
const path = require("path");
const { pid } = require("process");
const db = require(path.join(__dirname, '../database.js'));
const { httpCodes, isAuthenticated, userCanAccessProject, parseIntBase10 } = require(path.join(__dirname, '..', 'utils'));
const projectRouter = express.Router();
const { projectIsValid, invitationIsValid } = require(path.join(__dirname, '../validation'));
//create a project for a specific user
projectRouter.post('/projects', isAuthenticated, projectIsValid, async (req, res) => {
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

projectRouter.post('/projects/:pid/share', isAuthenticated, shareIsValid, async (req, res) => {
    //add entry to project members
    const data = matchedData(req);
    await db.projectMember.create({
        data: {
            projectId: parseIntBase10(req.params.pid),
            userId: req.inviteeId,
            role: data.role
        }
    });
    res.json(":)");
});

//read a specific user's projects
projectRouter.get('/projects', isAuthenticated, async (req, res) => {
    const projects = await db.project.findMany({
        where: {
            ownerId : req.session.userId
        }
    });
    return res.json(projects);
});

//read a specific project from a user
projectRouter.get('/projects/:pid', userCanAccessProject, async (req, res) => {
    const project = await db.project.findUnique({
        where : {
            ownerId: req.session.userId,
            id: parseIntBase10(req.params.pid)
        }
    })
    return res.json(project);
});

projectRouter.patch('/projects/:pid', userCanAccessProject, projectIsValid, async (req, res) => {
    await db.project.update({
        where: {
            id : parseIntBase10(req.params.pid)
        }, 
        data: {
            title : req.body.title
        }
    });
    return res.json(null);
});

projectRouter.delete('/projects/:pid', userCanAccessProject, async (req, res) => {
    await db.project.delete({
        where : {
            id : parseIntBase10(req.params.pid)
        }
    });
    return res.json(null);
});

module.exports = projectRouter;