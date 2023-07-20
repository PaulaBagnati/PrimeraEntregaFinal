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

    return this.#carts.find((c) => c.id == id);
  }

  //Create a new cart
  async create(cart) {
    await this.#readFile();

    const id = (this.#carts[this.#carts.length - 1]?.id || 0) + 1;

    const newCart = {
      id,
      ...cart,
      products: [],
    };

    this.#carts.push(newCart);

    await this.#writeFile();

    return newCart;
  }

  async existInCart(cart, idProduct) {
    return cart.products.find((p) => p.product == idProduct);
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

    if (this.#carts[cart.id - 1].products == "") {
      this.#carts[cart.id - 1].products.pop();
    }

    cart.products = {
      product: newProduct.productId,
      quantity: newProduct.cantidad,
    };

    this.#carts[cart.id - 1].products.push(cart.products);

    await this.#writeFile();

    return cart;
  }

  //Create a new entry in the products array for a determined cart
  async updateProduct(cart, product) {
    await this.#readFile();

    let cantidad = cart.products[0]["quantity"] + 1;

    //cart.products[0]["quantity"] = cantidad;

    this.#carts[cart.id - 1].products[0]["quantity"] = cantidad;

    await this.#writeFile();

    return this.#carts[cart.id - 1].products[0]["quantity"];
  }
}

module.exports = CartManager;
