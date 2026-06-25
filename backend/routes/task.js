const express = require('express');
const path = require('path');
const {dbQuery} = require(path.join(__dirname, '../database.js'));
const {taskIsValid} = require(path.join(__dirname, '../validation'));
const {validationResult, matchedData} = require('express-validator');
const { title } = require('process');
const {parseIntBase10, isAuthenticated, checkValidation, userCanAccessProject, userHasMemberTaskAccess, userHasOwnerTaskAccess, userOwnsProject} = require(path.join(__dirname, '../utils'));
const { httpCodes } = require(path.join('..', 'constants'));
const taskRouter = express.Router();

//create a task
taskRouter.post('/projects/:pid/tasks', userCanAccessProject, dbQuery({
    table: 'task',
    queryType: 'create',
    query: (req) => ({
        data : {
            title: req.body.title,
            description: req.body.description,
            projectId: parseIntBase10(req.params.pid)
        }
    })
}));
 
//read all tasks of a specific project
taskRouter.get('/projects/:pid/tasks', userCanAccessProject, dbQuery({
    table: 'task',
    queryType: 'findMany',
    query: (req) => ({
        where : {
            projectId: parseIntBase10(req.params.pid)
        }
    }),
    formResult: (req, record) => ({
        tasks: record,
        role: req.role
    })
}));

//read a specific task
taskRouter.get('/projects/:pid/tasks/:tid', userHasMemberTaskAccess, dbQuery({
    table: 'task',
    queryType: 'findUnique',
    query: req => ({
        where: {
            id : parseIntBase10(req.params.tid)
        }
    })
}));

//update a specfic task
taskRouter.patch('/projects/:pid/tasks/:tid', userHasMemberTaskAccess, dbQuery({
    table: 'task',
    queryType: 'update',
    query: req => ({
        where: {
            id: parseIntBase10(req.params.tid)
        },
        data : {
            title: req.body.title,
            description: req.body.description,
            finished: req.body.finished,
            updatedAt: new Date()
        }
    })
}));

//create a task for a specific project
taskRouter.post('/projects/:pid', userCanAccessProject, taskIsValid, dbQuery({
    table: 'tasks',
    queryType: 'create',
    query: req => ({
        table: 'task',
        projectId: parseIntBase10(req.params.pid),
        title: req.body.title,
        description: req.body.description,
        finished: req.body.finished
    })
}));

//delete a specific task
taskRouter.delete("/projects/:pid/tasks/:tid", userHasOwnerTaskAccess, dbQuery({
    table: 'task',
    queryType: 'delete',
    query: req => ({
        where : {
            id : parseIntBase10(req.params.tid)
        }
    })
}));

module.exports = taskRouter;