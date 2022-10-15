const db = require("../models");
const User = db.user;

checkEmail = (req, res,next) => {
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(email => {
        if(email) {
            res.status(400).send({
                msg: "email sudah ada"
            });
            return;
        }
    })
    next();
}

const verifyRegister = {
    checkEmail: checkEmail
};

module.exports = verifyRegister;