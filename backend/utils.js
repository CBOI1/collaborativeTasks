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
    const pRecord = await db.project.findUnique({
        where : {
            id : parseIntBase10(req.params.pid),
            ownerId: req.session.userId
        }
    });
    if (!pRecord) {
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
                select : {
                    ownerId : true
                }
            }
        }
    });
    if (tRecord === null || tRecord.project.ownerId !== req.session.userId) {
        return res.status(httpCodes.BAD_REQUEST).json({});
    }
    next();
}

module.exports = {
    httpCodes,
    parseIntBase10 : (num) => parseInt(num, 10),
    isAuthenticated,
    userCanAccessProject : [isAuthenticated, userOwnsProject],
    userCanAccessTask : [isAuthenticated, userOwnsTask]
}