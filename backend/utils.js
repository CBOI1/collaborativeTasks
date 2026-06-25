const { validationResult } = require('express-validator');
const { db } = require('./database');
const { userInfo } = require('os');
const { httpCodes } = require('./constants');

const parseIntBase10 = (num) => parseInt(num, 10);

const isAuthenticated = (req, res, next) =>  {
    if (!req.session.userId) {
        res.status(httpCodes.UNAUTHENTICATED).json(null);
    } else {
        next();
    }
}


const isMemberWithAllowedRole = ({roles = []}) => {
    return async (req, res, next) => {
        if (req.params.pid === 'undefined') {
            return res.status(httpCodes.BAD_REQUEST).json({});
        }
        const memberRecord = await db.projectMember.findUnique({
            where : {
                projectId_userId : {
                    projectId : parseIntBase10(req.params.pid),
                    userId: req.session.userId
                },
            }
        });
        if (!memberRecord || !roles.includes(memberRecord.role)) {
            return res.status(httpCodes.BAD_REQUEST).json({});
        }
        req.role = memberRecord.role;
        next();
    }
}



const taskAssociatedWithProject = async (req, res, next) => { 
    const record = await db.project.findUnique({
        where: {
            id : parseIntBase10(req.params.pid)
        },
        include : {
            tasks : {
                where: {
                    id : parseIntBase10(req.params.tid)
                }
            }
        }
    });
    if (record.tasks.length == 0) {
        res.status(httpCodes.BAD_REQUEST).json(null);
    }
    next();
}

module.exports = {
    httpCodes,
    parseIntBase10 : (num) => parseInt(num, 10),
    isAuthenticated,
    userOwnsProject : [isAuthenticated, isMemberWithAllowedRole({roles : ["OWNER"]})],
    userCanAccessProject: [isAuthenticated, isMemberWithAllowedRole({roles: ["MEMBER", "OWNER"]})],
    userHasMemberTaskAccess : [isAuthenticated, taskAssociatedWithProject],
    userHasOwnerTaskAccess: [isAuthenticated, isMemberWithAllowedRole({roles: ["OWNER"]}), taskAssociatedWithProject]
}