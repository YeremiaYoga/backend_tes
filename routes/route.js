module.exports = app => {
    const produk = require("../controllers/produkController.js");

    const router = require("express").Router();

    router.post("/", produk.create);

    router.get("/", produk.findAll);

    router.get("/:id",produk.findOne);

    router.put("/:id", produk.update);

    router.delete("/:id",produk.delete);

    app.use("/api/produk",router);
}