const router = require('express').Router();
const { getAndVerifyToken } = require('../middlewares/authentication');

const Product = require('../models/product');
const { route } = require('./category');

// Obtener todos los productos: populate --> user, categoria
router.get('/product', getAndVerifyToken, (request, response) => {
  // Obtener productos de la DB
  Product.find({ enable: true })
    .sort('name')
    .populate('user', 'name email')
    .populate('category', 'description')
    .exec((error, productsDB) => {

      if (error) {
        return response.status(500).json({
          ok: false,
          error
        });
      }

      response.json({
        ok: true,
        productsDB
      });

    });

});

// Obtener productos por id: populate,user categoria
router.get('/product/:id', getAndVerifyToken, (request, response) => {
  // Obtener 'id' de la url
  const { id } = request.params;

  Product.findById({ _id: id })
    // .populate()
    .exec((error, productDB) => {

      if (error) {
        return response.status(500).json({
          ok: false,
          error
        });
      }

      if (!productDB) {
        return response.status(400).json({
          ok: false,
          error: {
            message: 'El "ID" es inválido.'
          }
        });
      }

      response.json({
        ok: true,
        productDB
      });

    });

});

// Buscar productos por el nombre
router.get('/product/search/:terms', (request, response) => {
  // Obtener 'nombre' del producto desde la url.
  const { terms } = request.params;
  // Convertirlo en una expresion regular
  const regularExp = new RegExp(terms);

  Product.find({ name: regularExp })
    .populate('category', 'name')
    .exec((error, productsDB) => {

      if (error) {
        return response.status(500).json({
          ok: false,
          error
        });
      }

      response.json({
        ok: true,
        productsDB
      });

    });

});

// Crear un producto: Grabar categoria y usuario
router.post('/product', getAndVerifyToken, (request, response) => {
  // Obtener info del request
  const { name, priceUni, description, enable, category } = request.body;
  // Obtener id del usuario desde el 'token'
  const { _id } = request.user;

  // Crea una instancia del Producto
  const product = new Product({
    name,
    priceUni,
    description,
    enable,
    category,
    user: _id
  });

  product.save((error, productDB) => {

    if (error) {
      return response.status(500).json({
        ok: false,
        error
      });
    }

    response.json({
      ok: true,
      productDB
    });

  });

});

// Actualizar un nuevo producto:
router.put('/product/:id', getAndVerifyToken, (request, response) => {
  // Obtener id de la url
  const { id } = request.params;
  const productInfo = request.body;

  Product.findByIdAndUpdate(id, productInfo, { new: true }, (error, productDB) => {

    if (error) {
      return response.status(500).json({
        ok: false,
        error
      });
    }

    if (!productDB) {
      return response.status(400).json({
        ok: false,
        error: {
          message: 'El "ID" es inválido.'
        }
      });
    }

    response.json({
      ok: true,
      productDB
    });

  });

});

// Eliminar un producto, cambiar a falso el valor del campo 'enable'.
router.delete('/product/:id', getAndVerifyToken, (request, response) => {
  // Obtener id de la url
  const { id } = request.params;
  // Cambiar el campo 'enable' a falso.
  const data = { enable: false }

  Product.findByIdAndUpdate(id, data, { new: true }, (error, productDB) => {

    if (error) {
      return response.status(500).json({
        ok: false,
        error
      });
    }

    response.json({
      ok: true,
      message: 'Producto eliminado',
      productDB
    });

  });

});

module.exports = router;