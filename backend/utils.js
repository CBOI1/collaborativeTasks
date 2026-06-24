const { validationResult } = require('express-validator');
const db = require('./database');

const httpCodes = {
    UNAUTHENTICATED : 401,
    BAD_REQUEST : 400
}

const parseIntBase10 = (num) => parseInt(num, 10);

const isAuthenticated = (req, res, next) =>  {
    if (!req.session.userId) {
        res.status(httpCodes.UNAUTHENTICATED).json(null);
    } else {
        next();
    }
}

//all paths will provide a pid as a route parameter
const userOwnsProject = async (req, res, next) => {
    if (req.params.pid === 'undefined') {
        return res.status(httpCodes.BAD_REQUEST).json({});
    }
    const memberRecord = await db.projectMember.findUnique({
        where : {
            projectId_userId : {
                projectId : parseIntBase10(req.params.pid),
                userId: req.session.userId
            }
        }
    });
    if (!memberRecord && memberRecord.role === "OWNER") {
        return res.status(httpCodes.BAD_REQUEST).json({});
    }
    next();
}

const userIsProjectMember = async (req, res, next) => {
    if (req.params.pid === 'undefined') {
        return res.status(httpCodes.BAD_REQUEST).json({});
    }
    const memberRecord = await db.projectMember.findUnique({
        where : {
            projectId_userId : {
                projectId : parseIntBase10(req.params.pid),
                userId: req.session.userId
            }
        }
    });
    if (!memberRecord && memberRecord.userId === req.session.userId) {
        return res.status(httpCodes.BAD_REQUEST).json({});
    }
    next();
}

const userOwnsTask = async (req, res, next) => {
    const tRecord = await db.task.findUnique({
        where : {
            id : parseIntBase10(req.params.tid),
            project : {
                id: parseIntBase10(req.params.pid),
            }
        },
        include : {
            project : {
                include: {
                    members: {
                        where : {
                            userId : req.session.userId
                        }
                    }
                }
            }
        }
    });
    const memberRecord = tRecord?.project.members[0];
    if (memberRecord === null || memberRecord.userId !== req.session.userId) {
        return res.status(httpCodes.BAD_REQUEST).json({});
    }
    next();
}

module.exports = {
    httpCodes,
    parseIntBase10 : (num) => parseInt(num, 10),
    isAuthenticated,
    userOwnsProject : [isAuthenticated, userOwnsProject],
    userCanAccessProject: [isAuthenticated, userIsProjectMember],
    userCanAccessTask : [isAuthenticated, userOwnsTask]
}