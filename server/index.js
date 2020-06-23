// Importar paquetes necesarios
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');

require('./config/config');

// TODO: Separar conexion de la BD del archivo principal.
const configMongo = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

mongoose.connect(process.env.URLDB, configMongo, (error, response) => {

  if (error) {
    throw new Error('No se pudo conectar a la BD: ', error);
  }

  console.log('Se conecto a la BD!');
});

// Iniciar Express
const app = express();

// Variables
app.set('port', process.env.PORT || 4000);

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')))

// Configuracion Global de Rutas
app.use(require('./routes/'));

// Iniciar servidor
app.listen(app.get('port'), () => {
  console.log(`Server on port: ${app.get('port')}`)
});