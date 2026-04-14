const { body } = require('express-validator');
const db = require("./database.js");
const MIN_PASSWORD_LEN = 8;
module.exports = {
    registerIsValid : [
        body("email")
        .trim()
        .isEmail()
        .custom(async (val) => {
            const emailTaken = await db.user.findUnique({
                where: { email: val }
            });
            console.log("emailTaken: ", emailTaken);
            if (emailTaken !== null) {
                throw new Error(`Email:${val} is already in use`);
            }
            return true;
        }),
        body("password").isLength({min: MIN_PASSWORD_LEN}),
        body("confirmPassword").custom((val, {req}) => val === req.body.password)
    ]
}
