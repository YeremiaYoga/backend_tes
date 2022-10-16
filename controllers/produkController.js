const db = require("../models");
const Produk = db.produk;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  if (!req.body.name) {
    res.status(400).send({
      msg: "Tidak ada",
    });
    return;
  }

  const produk = {
    name: req.body.name,
    ket: req.body.ket,
  };

  Produk.create(produk)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        msg: err.msg,
      });
    });
};
exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { [Op.iLike]: `%${name}%` } } : null;

  Produk.findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.statu(500).send({
        msg: err.msg,
      });
    });
};
exports.findOne = (req,res) => {
  const id = req.params.id;

  Produk.findByPk(id)
  .then(data => {
    if(data) {
      res.send(data);
    }else{
      res.status(404).send({
        msg: "Tidak ada produk"
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      msg: err.msg,
    });
  });
}
exports.update = (req, res) => {
  const id = req.params.id;

  Produk.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          msg: "Update produk berhasil",
        });
      } else {
        res.send({
          msg: "tidak bisa update produk",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        msg: err.msg,
      });
    });
};
exports.delete = (req, res) => {
  const id = req.params.id;

  Produk.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          msg: "Delete produk berhasil",
        });
      } else {
        res.send({
          msg: "tidak bisa delete produk",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        msg: err.msg,
      });
    });
};
