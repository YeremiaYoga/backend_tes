const { verifyRegister } = require("../middleware");
const controller = require("../controllers/authController");
const tokencons = require("../controllers/refreshToken");
const { verifyToken } = require("../middleware/authJwt");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.post("/api/register", [verifyRegister.checkEmail], controller.Register);
  app.post("/api/login", controller.Login);

  app.get("/api/verif", controller.ValidateJwt);

  app.get("/api/token", tokencons.RefreshToken);

  app.delete("/api/logout", controller.Logout);
  app.get("/api/user", verifyToken, controller.getUserAll);
  app.get("/api/user/:id", verifyToken, controller.getUserId);
};
