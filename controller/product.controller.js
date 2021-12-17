const db = require('../db');
const fs = require('fs'); // Для редактирования файлов
const Jimp = require('jimp'); // Для редактирования изображений

class ProductController {
  /** При получении POST запроса /api/products с объектом JSON {"name": "abc", "price": 123, "amount": 45} */
  async createProduct(req, res) {
    const {name, price, amount} = req.body;
    const newProduct = await db.query('INSERT INTO products (name, price, amount) values ($1, $2, $3) RETURNING *', [name, price, amount]);
    console.log(`[POST] CREATED PRODUCT WITH NAME - ${name}`);
    res.json(newProduct.rows[0]);
  }

  /** При получении GET запроса /api/products */
  async getProducts(req, res) {
    const products = await db.query('SELECT * FROM products');

    // При получении GET запроса /api/products?limit=5 или /api/product?limit=10&page=1
    if(req.query.limit > 0) {
      // Проверки на наличие параметра limit или page в строке
      let limit = typeof Number(req.query.limit) === 'number' && req.query.limit !== undefined ? Number(req.query.limit) : 10;
      let page = typeof Number(req.query.page) === 'number' && req.query.page !== undefined ? Number(req.query.page) : 1;
      let countOfPages = Math.ceil(products.rows.length / limit);
      let currentProduct = page > 0 ? limit * (page - 1) : 0;

      console.log(`[GET] GET PAGINATED PRODUCTS WITH LIMIT - ${limit}, PAGE - ${page}`);

      if(page > countOfPages) {
        res.json({
          "error": 404,
          "first": `/api/products?limit=${limit}&page=1`});
      }
      else {
        res.json({
          "product": products.rows.slice(currentProduct, currentProduct + limit),
          "limit": limit,
          "pages": countOfPages,
          "links": {
            "next": `${page >= countOfPages ? '' : '/api/products?limit=' + limit  +'&page=' + (page + 1)}`,
            "prev": `${page == 1 ? '' : '/api/products?limit=' + limit  +'&page=' + (page - 1)}`
          }
        });
      }
    }
    else {
      console.log('[GET] GET ALL PRODUCTS');
      res.json(products.rows);
    }
  }
  /** При получении GET запроса /api/products/id */
  async getOneProduct(req, res) {
    const id = req.params.id;
    const product = await db.query('SELECT * FROM products where id = $1', [id]);
    console.log(`[GET] GET ONE PRODUCT WITH ID - ${id}`);
    res.json(product.rows[0]);
  }

  /** При получении PUT запроса /api/products/id с объектом JSON {"id": 1, "name": "abc", "price": 123, "amount": 45} */
  async updateProduct(req, res) {
    const {id, name, price, amount} = req.body;
    const product = await db.query('UPDATE products set name = $1, price = $2, amount = $3 where id = $4 RETURNING *', [name, price, amount, id]);
    console.log(`[PUT] UPDATE PRODUCT WITH ID - ${id}`);
    res.json(product.rows[0]);
  }

  /** При получении DELETE запроса /api/products/id */
  async deleteProduct(req, res) {
    const id = req.params.id;
    const product = await db.query('DELETE FROM products where id = $1', [id]);
    fs.unlink(`./images/${id}.jpg`, (error) => {
      if(error) console.log(error);
    });
    console.log(`[DELETE] DELETE PRODUCT WITH ID - ${id}`);
    res.json(product.rows[0]);
  }

  /** При получении POST запроса /api/products/upload/:id с объектом form-data с ключом image*/
  async uploadImage(req, res) {
    const id = req.params.id;
    let image = req.files.image;

    Jimp.read(image.data).then(image => {
      image.quality(90)
           .writeAsync(`./images/${id}.jpg`);

      console.log(`[POST] UPLOAD IMAGE FOR ID - ${id}`);
      res.json(req.files.image);
    }).catch(error => {
      console.log(error);
    });
  }
}

module.exports = new ProductController();