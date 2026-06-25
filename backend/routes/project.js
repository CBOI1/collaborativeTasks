const express = require("express");
const { matchedData } = require("express-validator");
const path = require("path");
const { pid } = require("process");
const {db, dbQuery} = require(path.join(__dirname, '../database.js'));
const { Role } = require(path.join(__dirname, "..", "/generated/prisma/client"));
const { httpCodes, isAuthenticated, userCanAccessProject, userOwnsProject, parseIntBase10 } = require(path.join(__dirname, '..', 'utils'));
const projectRouter = express.Router();
const { projectIsValid, invitationIsValid, shareIsValid } = require(path.join(__dirname, '../validation'));
//create a project for a specific user
projectRouter.post('/projects', isAuthenticated, projectIsValid, async (req, res) => {
    const userId = req.session.userId;
    const projectRecord = await db.project.create({
        data: {
            title: req.body.title,
            ownerId : userId
        }
    });
    const ownerRecord = await db.projectMember.create({
        data: {
            projectId : projectRecord.id,
            userId: parseIntBase10(req.session.userId),
            role: Role.OWNER
        }
    });
    return res.json({
        project: projectRecord,
        membership : ownerRecord
    })
});

projectRouter.post('/projects/:pid/share', isAuthenticated, shareIsValid, async (req, res) => {
    //add entry to project members
    const memberRecord = await db.projectMember.create({
        data: {
            projectId: parseIntBase10(req.params.pid),
            userId: req.inviteeId,
            role: req.role
        }
    });
    res.json({
        membership: memberRecord
    });
});

//read a specific user's projects
projectRouter.get('/projects', isAuthenticated, async (req, res) => {
    const memberRecords = await db.projectMember.findMany({
        where: {
            userId: req.session.userId
        },
        include: {
            project: true
        }
    });
    return res.json(memberRecords.map(record => ({...record.project, role: record.role})));
});

//read a specific project from a user
projectRouter.get('/projects/:pid', userCanAccessProject, async (req, res) => {
    const memberRecord = await db.projectMember.findUnique({
        where : {
            projectId_userId : {
                userId: req.session.userId,
                projectId: parseIntBase10(req.params.pid)
            }
        },
        include : {
            project: true
        }
    });
    return res.json(memberRecord.project);
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

projectRouter.delete('/projects/:pid', userOwnsProject, async (req, res) => {
    await db.project.delete({
        where : {
            id : parseIntBase10(req.params.pid)
        }
    });
    return res.json(null);
});

module.exports = projectRouter;