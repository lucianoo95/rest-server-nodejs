const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

// Loguear usuario existente.
router.post('/login', (request, response) => {

  // Obtener campos enviados en el formulario
  const { email, password } = request.body;

  // Obtener usuario por 'email'
  User.findOne({ email }, (error, userDB) => {
    if (error) {
      return response.status(500).json({
        ok: false,
        error
      });
    }

    // Verificar que el usuario exista en la Base de datos.
    if (!userDB) {
      return response.status(400).json({
        ok: false,
        error: {
          message: '(Usuario) o contraseña incorrectos.'
        }
      });
    }

    // Si el usuario existe, verificar la contraseña ingresada con la almacenada en la BD.
    if (!bcrypt.compareSync(password, userDB.password)) {
      return response.status(400).json({
        ok: false,
        error: {
          message: 'Usuario o (contraseña) incorrectos.'
        }
      });
    }

    // Generar token
    const token = jwt.sign({
      user: userDB
    }, process.env.SEED, { expiresIn: process.env.TOKEN_EXPIRATION });

    // Usuario logueado correctamente
    response.json({
      ok: true,
      userDB,
      token
    });

  });

});

module.exports = router;