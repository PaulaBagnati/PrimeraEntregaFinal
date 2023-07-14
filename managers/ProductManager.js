const fs = require("fs/promises");
const path = require("path");

class ProductManager {
  #productos = [];

  constructor(filename) {
    this.filename = filename;
    this.filepath = path.join(__dirname, "../data", this.filename);
  }

  #readFile = async () => {
    const data = await fs.readFile(this.filepath, "utf-8");

    if (data == "") {
      this.#productos = [
        "El archivo se encuentra vacío, por favor, ingrese un producto",
      ];
    } else {
      this.#productos = JSON.parse(data);
    }
  };

  #writeFile = async () => {
    const data = JSON.stringify(this.#productos, null, 2);
    await fs.writeFile(this.filepath, data);
  };

  async getAll() {
    await this.#readFile();

    return this.#productos;
  }

  async getById(id) {
    await this.#readFile();

    return this.#productos.find((p) => p.id == id);
  }

  async create(product) {
    await this.#readFile();

    const id = (this.#productos[this.#productos.length - 1]?.id || 0) + 1;

    const newProduct = {
      id,
      ...product,
    };

    if (
      this.#productos[0] ==
      "El archivo se encuentra vacío, por favor, ingrese un producto"
    ) {
      this.#productos.pop();
    }

    this.#productos.push(newProduct);

    await this.#writeFile();

    return newProduct;
  }

  async save(id, producto) {
    await this.#readFile();

    const existing = await this.getById(id);

    if (!existing) {
      return;
    }

    const { title, description, stock, price, keywords } = producto;

    existing.title = title;
    existing.description = description;
    existing.stock = stock;
    existing.price = price;
    existing.keywords = keywords;

    await this.#writeFile();
  }

  async delete(id) {
    await this.#readFile();

    this.#productos = this.#productos.filter((p) => p.id != id);

    await this.#writeFile();
  }
}

// exporto la clase ProductManager
module.exports = ProductManager;
