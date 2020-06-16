// Inicializar: express,
const express = require('express');
const mongoose = require('mongoose');

require('./config/config');

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

// Middleware
app.use(express.json());

// Routes
app.use(require('./routes/user'));

// Iniciar servidor
app.listen(app.get('port'), () => {
  console.log(`Server on port: ${app.get('port')}`)
});