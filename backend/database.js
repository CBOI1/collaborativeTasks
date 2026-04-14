const path = require("path");
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require(path.join(__dirname, "/generated/prisma/client"));
const connectionString = `${process.env["DATABASE_URL"]}`

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

module.exports = prisma;
