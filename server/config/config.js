// ENTORNO:
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// BASE DE  DATOS
let urlDB;

if (process.env.NODE_ENV === 'dev') {
  urlDB = 'mongodb://localhost:27017/coffee';
} else {
  urlDB = 'mongodb+srv://user1:6EfYCUwBsiPhQ0CP@cluster0-ntlui.mongodb.net/coffee';
}

process.env.URLDB = urlDB;