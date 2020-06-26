// ENTORNO:
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// VENCIMIENTO DEL TOKEN
//60 seg, 60min, 24hs, 30dias.
process.env.TOKEN_EXPIRATION = '48h';

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

// GOOGLE CLIENT ID 
process.env.CLIENT_ID = process.env.CLIENT_ID || '386637654686-jr51gg8s904ksgc1l0b7nfb4s29b9qe4.apps.googleusercontent.com';
 