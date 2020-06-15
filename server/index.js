// Inicializar: express,
const express = require('express');
const app = express();
const path = require('path');

// Variables
app.set('port', process.env.PORT || 4000);

// Middleware
app.use(express.json());

// Routes
app.get('/users', (request, response) => {
  response.json('Get Usuario!');
});

app.post('/users', (request, response) => {

  const { name, lastname } = request.body;

  if (!name) {

    response.status(400).json({
      ok: false,
      message: 'The name is required'
    });

  } else {
    response.json({
      data: {
        name,
        lastname
      }
    });
  }

});

app.put('/users/:id', (request, response) => {

  const { id } = request.params;

  response.json({
    id
  });

});

app.delete('/users', (request, response) => {
  response.json('Delete usuario');
});

// Iniciar servidor
app.listen(app.get('port'), () => {
  console.log(`Server on port: ${app.get('port')}`)
});