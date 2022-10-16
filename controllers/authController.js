const db = require("../models");
const config = require("../config/auth");
const User = db.user;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { secret } = require("../config/auth");

exports.Register = async (req, res) => {
  const { name, email, gender, password } = req.body;
  if (
    gender.toLowerCase() !== "laki-laki" &&
    gender.toLowerCase() !== "perempuan"
  ) {
    return res.status(400).json({ msg: "Jenis Kelamin tidak diketahui" });
  }
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  try {
    await User.create({
      name: name,
      email: email,
      gender: gender,
      password: hashPassword,
    });
    res.json({ msg: "Berhasil registrasi" });
  } catch (error) {
    console.log(error);
  }
};

exports.Login = async (req, res) => {
  try {
    const user = await User.findAll({
      where: {
        email: req.body.email,
      },
    });
    const match = await bcrypt.compare(req.body.password, user[0].password);
    if (!match) return res.status(400).json({ msg: "Password salah" });
    const userId = user[0].id;
    const name = user[0].name;
    const gender = user[0].gender;
    const accessToken = jwt.sign({ userId, name, gender }, config.secret, {
      expiresIn: 86400,
    });
    const refreshToken = jwt.sign({ userId, name, gender }, config.refresh, {
      expiresIn: 86400,
    });
    await User.update(
      { refresh_token: refreshToken },
      {
        where: {
          id: userId,
        },
      }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({
      accessToken,
      userId,
    });
  } catch (error) {
    res.status(404).json({ msg: "Akun tidak ada" });
  }
};

exports.Logout = async (req, res) => {
  console.log("logot");
  try {
    const refreshToken = req.cookies.refreshToken;
    console.log(refreshToken);
    if (!refreshToken) return res.sendStatus(204);
    const user = await User.findAll({
      where: {
        refresh_token: refreshToken,
      },
    });
    if (!user[0]) return res.sendStatus(204);
    const userId = user[0].id;
    await User.update(
      { refresh_token: null },
      {
        where: {
          id: userId,
        },
      }
    );
    res.clearCookie("refreshToken");
    return res.sendStatus(200);
  } catch (error) {
    return res.status(403).send({
      msg: error.message,
    });
  }
};

exports.ValidateJwt = (req, res) => {
  let token = req.headers["x-access-token"];
  console.log(req.headers);
  if (!token) {
    return res.status(403).send({
      msg: "No token",
    });
  }
  console.log(token);
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      console.log(err);
      return res.status(401).send({
        msg: "Unauthorized!",
      });
    }
    req.userId = decoded.id;
    res.json({ msg: "Validated Berhasil" });
  });
};

exports.getUserId = (req, res) => {
  const id = req.params.id;

  User.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          msg: "Tidak ada user",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        msg: err.msg,
      });
    });
};

exports.getUserAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { [Op.iLike]: `%${name}%` } } : null;

  User.findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.statu(500).send({
        msg: err.msg,
      });
    });
};
