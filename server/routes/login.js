const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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

const verify = async (token) => {
  // Veificar token de Google
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const { name, email, picture } = ticket.getPayload();

  return {
    name,
    email,
    picture,
    google: true
  }

}

router.post('/google', async (request, response) => {
  // Obtener token del request
  const token = request.body.token;

  // validar Token de Google
  const googleUser = await verify(token)
    .catch(error => {
      return response.status(403).json({
        ok: false,
        error
      });
    });

  // Verificar si el usuario existe en la BD
  User.findOne({ email: googleUser.email }, (error, userDB) => {
    if (error) {
      return response.status(500).json({
        ok: false,
        error
      });
    }

    if (userDB) {
      // Si el user NO es autenticado por Google, se logueo normalmente con email y password
      if (userDB.google === false) {
        return response.status(400).json({
          ok: false,
          error: {
            message: 'Debe usar su autenticación normal.'
          }
        });
      } else {
        // El usuario SI se autentico por Google
        // Generar token
        const token = jwt.sign({
          user: userDB
        }, process.env.SEED, { expiresIn: process.env.TOKEN_EXPIRATION });

        return response.json({
          ok: true,
          user: userDB,
          token
        });

      }

    } else {
      // Si el usuario no existe en la BD.
      const user = new User();

      user.name = googleUser.name;
      user.email = googleUser.email;
      user.img = googleUser.picture;
      user.google = true;
      // Establecer cualquier password para pasar la validacion.
      user.password = '0000';

      // Guardar usuario en la BD
      user.save((error, userDB) => {
        if (error) {
          return response.status(500).json({
            ok: false,
            error
          });
        }

        // Generar token
        const token = jwt.sign({
          user: userDB
        }, process.env.SEED, { expiresIn: process.env.TOKEN_EXPIRATION });

        return response.json({
          ok: true,
          user: userDB,
          token
        });

      });

    }

  });

});

module.exports = router;