const path = require("path");
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require(path.join(__dirname, "/generated/prisma/client"));
const connectionString = `${process.env["DATABASE_URL"]}`
const {httpCodes} = require('./constants');

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const dbQuery = ({table, queryType, query, formResult = (req, record) => record}) => {
    return async (req, res) => {
        const record = await prisma[table][queryType](query(req))
        if (record === null) {
            res.status(httpCodes.BAD_REQUEST).json(null);
        }
        return res.json(formResult(req, record))
    }
}

module.exports = {
    db : prisma,
    dbQuery
};
