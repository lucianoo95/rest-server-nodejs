// Importar paquete JWT para obtener la info del token.
const jwt = require('jsonwebtoken');

const getAndVerifyToken = (request, response, next) => {
  // Obtener token de Request-headers. 
  let token = request.get('Authorization');

  // Eliminar Bearer del token.
  token = token.slice(7);

  // Verificar token
  jwt.verify(token, process.env.SEED, (error, decoded) => {
    // Token no válido
    if (error) {
      const { message } = error;

      return response.status(401).json({
        ok: false,
        error: {
          message: 'Error: No Autorizado.',
          type: message
        }
      });
    }

    // Token válido
    request.user = decoded.user;

    next();
  });

};

const verifyAdminRole = (request, response, next) => {
  // Obtener usuario
  const user = request.user;
  // Validar rol del usuario
  if (user.role === 'ADMIN_ROLE') {
    next();
  } else {
    return response.status(403).json({
      ok: false,
      error: {
        message: 'El usuario no es administrador.'
      }
    });
  }

}

module.exports = { getAndVerifyToken, verifyAdminRole };