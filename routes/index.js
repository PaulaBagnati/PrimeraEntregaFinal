const { Router } = require("express");

const ProductsRouter = require("./api/product.router");
const CartsRouter = require("./api/cart.router");

// /api
const router = Router();

// rutas de products
router.use("/productos", ProductsRouter);
// rutas de usuarios
router.use("/carts", CartsRouter);

module.exports = router;
