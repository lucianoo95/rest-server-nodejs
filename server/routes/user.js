const router = require('express').Router();

const bcrypt = require('bcrypt');
const _ = require('underscore');

const User = require('../models/user');
const { getAndVerifyToken, verifyAdminRole } = require('../middlewares/authentication');

// Listar usuario
router.get('/user', getAndVerifyToken, (request, response) => {
  
  // Filtrar limite de usuarios y orden
  const since = Number(request.query.since) || 0;
  const limit = Number(request.query.limit) || 5;

  // Obtener usuarios y filtrar que campos deben mostrarse. 
  User.find({ state: true }, 'name email role state google image')
    .skip(since)
    .limit(limit)
    .exec((error, users) => {
      if (error) {
        return response.status(400).json({
          ok: false,
          error
        });
      }

      // Contar la cantidad de registros de la coleccion y retornar una respuesta
      User.count({ state: true }, (error, count) => {
        response.json({
          ok: true,
          users,
          quantity: count
        });
      });

    });

});

// Agregar un nuevo usuario
router.post('/user', [getAndVerifyToken, verifyAdminRole], (request, response) => {
  // Obtener datos del body.
  const { name, email, password, role } = request.body;

  // Crear una instancia del modelo User
  const user = new User({
    name,
    email,
    password: bcrypt.hashSync(password, 10),
    role
  });

  // Guardar nuevo Usuario
  user.save((error, userDB) => {
    if (error) {
      return response.status(400).json({
        ok: false,
        error
      });
    }

    response.json({
      ok: true,
      user: userDB
    });

  });

});

// Modificar un usuario
router.put('/user/:id', [getAndVerifyToken, verifyAdminRole], (request, response) => {
  // Obtener datos (id) de la url
  const { id } = request.params;

  // Elegir que campos pueden modificarse en la DB.
  const body = _.pick(request.body, ['name', 'email', 'image', 'role', 'state']);

  // Actualizar Usuario
  User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (error, userDB) => {
    if (error) {
      return response.status(400).json({
        ok: false,
        error
      });
    }

    response.json({
      ok: true,
      userDB
    });

  });

});

// Eliminar un usuario
router.delete('/user/:id', [getAndVerifyToken, verifyAdminRole], (request, response) => {
  // Seleccionar id del usuario
  const { id } = request.params;
  // Cambiar el valor del 'state' del usuario
  const changeState = { state: false };

  // Actualizar 'state' del Usuario.
  User.findByIdAndUpdate(id, changeState, { new: true }, (error, userDB) => {
    if (error) {
      return response.status(400).json({
        ok: false,
        error
      });
    }

    response.json({
      ok: true,
      userDB
    });

  });

});

module.exports = router;