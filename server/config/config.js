// ENTORNO:
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// VENCIMIENTO DEL TOKEN
//60 seg, 60min, 24hs, 30dias.
process.env.TOKEN_EXPIRATION = 60 * 60 * 24 * 30;

// SEED de atuenticación
process.env.SEED = process.env.SEED || 'this-is-seed-development';

// BASE DE  DATOS
let urlDB;

if (process.env.NODE_ENV === 'dev') {
  urlDB = 'mongodb://localhost:27017/coffee';
} else {
  urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;