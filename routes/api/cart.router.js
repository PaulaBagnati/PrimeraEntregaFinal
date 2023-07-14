const CartManager = require("../../managers/CartManager");
const cartManager = new CartManager("carts.json");

const ProductManager = require("../../managers/ProductManager");
const productManager = new ProductManager("products.json");

const { Router } = require("express");
const router = Router();

//Search products of a given id cart
router.get("/:cid", async (req, res) => {
  const id = req.params.cid;
  const cart = await cartManager.getById(id);

  if (!cart) {
    res.send(
      "No se encuentra un carrito de compras con el identificador proporcionado"
    );
    res.sendStatus(404);
    return;
  } else if (cart["products"] == "") {
    res.status(201).send("Este carrito no contiene productos seleccionados");
  } else {
    res.status(201).send(cart["products"]);
  }

  res.send(cart);
});

//Create a new cart
router.post("/", async (req, res) => {
  const { body } = req;

  const cart = await cartManager.create(body);

  res.status(201).send(cart);
});

//Save a product into a cart by product id
router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { body } = req;

    const cart = await cartManager.getById(body.cid);

    if (!cart) {
      res.send(
        "No se encuentra un carrito de compras con el identificador proporcionado"
      );
      res.sendStatus(404);
      return;
    } else {
      const product = await productManager.getById(body.pid);

      if (!product) {
        res.status(201).send("El producto solicitado no se encuentra");
        res.sendStatus(404);
        return;
      } else if (product.stock == 0) {
        res
          .status(201)
          .send(
            "No contamos con el stock necesario del producto requerido. Disculpe las molestias"
          );
      } else {
        const existe = await cartManager.existInCart(cart, product.id);
        const cantidad = 1; //Momentaneamente hasta hacerlo dinamico

        if (existe == undefined) {
          const productInCart = await cartManager.createProduct(
            cart,
            product.id,
            cantidad
          );
        } else {
        }

        //   res.status(201).send(productCart);
        //   await productManager.save(id, body);
        //   res.sendStatus(202);
      }
    }
  } catch (e) {
    res.status(500).send({
      message: "Ha ocurrido un error en el servidor",
      exception: e.stack,
    });
  }
});

module.exports = router;
