const fs = require("fs/promises");
const path = require("path");

class CartManager {
  #carts = [];

  constructor(filename) {
    this.filename = filename;
    this.filepath = path.join(__dirname, "../data", this.filename);
  }

  #readFile = async () => {
    const data = await fs.readFile(this.filepath, "utf-8");
    this.#carts = JSON.parse(data);
  };

  #writeFile = async () => {
    const data = JSON.stringify(this.#carts, null, 2);
    await fs.writeFile(this.filepath, data);
  };

  //Take data from cart id
  async getById(id) {
    await this.#readFile();

    return this.#carts.find((p) => p.id == id);
  }

  //Create a new cart
  async create(cart) {
    await this.#readFile();

    const id = (this.#carts[this.#carts.length - 1]?.id || 0) + 1;

    const newCart = {
      id,
      ...cart,
    };

    this.#carts.push(newCart);

    await this.#writeFile();

    return newCart;
  }

  async existInCart(cart, idProduct) {
    return cart.products.find((p) => p.id == idProduct);
  }

  //Create a new entry in the products array for a determined cart
  async createProduct(cart, productId, cantidad) {
    await this.#readFile();

    const newProduct = {
      productId,
      cantidad,
    };

    if (cart.products == "") {
      cart.products.pop();
    }

    cart.products.id = newProduct.productId;
    cart.products.cantidad = newProduct.cantidad;

    this.#carts[cart.id - 1].products.push(cart.products);

    await this.#writeFile();

    return cart;
  }
}

module.exports = CartManager;
