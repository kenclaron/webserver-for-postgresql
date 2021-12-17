const Router = require('express');
const router = new Router();
const productController = require('../controller/product.controller');

router.post('/products', productController.createProduct);
router.get('/products', productController.getProducts);
router.get('/products/:id', productController.getOneProduct);
router.put('/products', productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);
router.post('/products/upload/:id', productController.uploadImage);

module.exports = router;