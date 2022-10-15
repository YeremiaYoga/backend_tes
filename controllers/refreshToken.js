const User = require("../models/user")
var jwt = require("jsonwebtoken");

exports.RefreshToken = async(req, res) => {
    try{
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) return res.sendStatus(401);
        const user = await User.findAll({
            where:{
                refresh_token:refreshToken
            }
        });
        if(!user[0]) return res.sendStatus(403);
        jwt.verify(refreshToken, config.secret, (err, decoded) => {
            if(err) return res.sendStatus(403);
            const userId = user[0].id;
            const name = user[0].name;
            const gender = user[0].gender;
            const accessToken = jwt.sign({userId, name, gender}, config.secret, {
                expiresIn: "15s"
            });
            res.json({accessToken});
        })
    }catch (error){
        console.log(error)
    }
}