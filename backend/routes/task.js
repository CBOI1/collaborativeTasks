const express = require('express');
const path = require('path');
const db = require(path.join(__dirname, '../database.js'));
const {taskIsValid} = require(path.join(__dirname, '../validation'));
const {validationResult, matchedData} = require('express-validator');
const {httpCodes, parseIntBase10, isAuthenticated, checkValidation, userCanAccessProject, userCanAccessTask} = require(path.join(__dirname, '../utils'));
const taskRouter = express.Router();

async function taskExistsInProject(req, res, next) {
    const userRecord = await db.task.findUnique({
        where: { id: parseIntBase10(req.params.id) }
    });
    if (userRecord === null || userRecord.userId !== req.session.userId) {
        return res.status(utils.httpCodes.BAD_REQUEST).json(null);
    }
    next();
}

//create a task
taskRouter.post('/projects/:pid/tasks', userCanAccessProject, async (req, res) => {
    const result = await db.task.create({
        data: {
            title: req.body.title,
            description: req.body.description,
            projectId : parseIntBase10(req.params.pid)
        }
    });
    res.json(result);
});

//read all tasks of a specific project
taskRouter.get('/projects/:pid/tasks', userCanAccessProject, async (req, res) => {
    const userRecords = await db.task.findMany({
        where: {
            projectId: parseIntBase10(req.params.pid)
        }
    });
    res.json(userRecords);
});

//read a specific task
taskRouter.get('/projects/:pid/tasks/:tid', userCanAccessTask, async (req, res) => {
    const pid = parseIntBase10(req.params.pid);
    const tid = parseIntBase10(req.params.tid);
    const userRecord = await db.task.findUnique({
        where: { id: parseIntBase10(req.params.tid), projectId: parseIntBase10(req.params.pid)}
    });
    if (userRecord === null) {
        res.status(httpCodes.BAD_REQUEST).json(null);
    } else {
        res.json(userRecord);
    }
});

//update a specfic task
taskRouter.patch('/projects/:pid/tasks/:tid', userCanAccessTask, taskIsValid, 
    async (req, res) => {
        const updatedRecord = await db.task.update({
        where : {
            id : parseInt(req.params.tid)
        },
        data : {
            title : req.body.title,
            description: req.body.description,
            finished: req.body.finished,
            updatedAt: new Date()
        }
    });
    res.json(updatedRecord);
});

//create a task for a specific project
taskRouter.post('/projects/:pid', userCanAccessProject, taskIsValid,
    async (req, res) => {
        const createdRecord = await db.task.create({
            data : {
                title : req.body.title,
                description: req.body.description,
                finished: req.body.finished,
                projectId: parseIntBase10(req.params.pid)
            }
        });
        res.json(createdRecord);
});

//delete a specific task
taskRouter.delete("/projects/:pid/tasks/:tid", userCanAccessTask, async (req, res) => {
    const deletedUser = await db.task.delete({
        where: {
            id: parseIntBase10(req.params.tid),
            projectId: parseIntBase10(req.params.pid)
        }
    });
    res.json(deletedUser);
});

module.exports = taskRouter;