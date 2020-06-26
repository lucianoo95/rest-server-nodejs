const router = require('express').Router();
const { getAndVerifyToken, verifyAdminRole } = require('../middlewares/authentication');
// Importar modelo Categoria
const Category = require('../models/category');

// Obtener todas las categorias
router.get('/category', getAndVerifyToken, (request, response) => {

  // Buscar categorias en la BD
  Category.find({})
    .sort('description') //Ordena los resultados por el campo que se especifique, en este caso 'description'
    .populate('user', 'name email') // Populate permite cargar info de otras colecciones simulando una. El primer parametro indica la coleccion y el segundo los campos que se quieren filtrar
    .exec((error, categoriesDB) => {

      if (error) {
        return response.status(500).json({
          ok: false,
          error
        });
      }

      response.json({
        ok: true,
        categoriesDB
      });

    });

});

// Mostrar una categoria por ID
router.get('/category/:id', getAndVerifyToken, (request, response) => {
  // Obtener '_id' del request params
  const { id } = request.params;

  // Buscar categoria por ID
  Category.findById({ _id: id }, (error, categoryDB) => {

    if (error) {
      return response.status(500).json({
        ok: false,
        error
      });
    }

    if (!categoryDB) {
      return response.status(400).json({
        ok: false,
        message: 'El "ID" no es válido.'
      });
    }

    response.json({
      ok: true,
      categoryDB
    });

  });

});

// Crear nueva categoria y regresar la nueva categoria
router.post('/category', getAndVerifyToken, (request, response) => {
  // Obtener id del usuario y body 
  const { _id } = request.user;
  const { description } = request.body;

  // Crear un objeto Categoria
  const category = new Category({
    description,
    user: _id
  });

  // Guardar nueva categoria
  category.save((error, categoryDB) => {

    if (error) {
      return response.status(500).json({
        ok: false,
        error
      });
    }

    response.json({
      ok: true,
      categoryDB
    });

  });

});

// Actualizar una catagoria
router.put('/category/:id', getAndVerifyToken, (request, response) => {
  // Obtener el 'id' del request
  const { id } = request.params;
  const description = request.body;

  Category.findByIdAndUpdate(id, description, { new: true }, (error, categoryDB) => {

    if (error) {
      return response.status(500).json({
        ok: false,
        error
      });
    }

    if (!categoryDB) {
      return response.status(400).json({
        ok: false,
        message: 'El "ID" no es válido.'
      });
    }

    response.json({
      ok: true,
      categoryDB
    });

  });
});

// Eliminar categoria ,solo un admin puede borrar la categoria, se elimina de la BD
router.delete('/category/:id', [getAndVerifyToken, verifyAdminRole], (request, response) => {
  // Obtener 'id' del request
  const { id } = request.params;

  Category.findByIdAndDelete(id, (error, result) => {

    if (error) {
      return response.status(500).json({
        ok: false,
        error
      });
    }

    if (!categoryDB) {
      return response.status(400).json({
        ok: false,
        message: 'El "ID" no es válido.'
      });
    }

    response.json({
      ok: true,
      message: 'Se elimino la categoria.'
    });

  });

});

module.exports = router;