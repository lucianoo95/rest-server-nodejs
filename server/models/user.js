const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

// Establecer tipo de Roles de los Usuarios.
const validRoles = {
  values: ['ADMIN_ROLE', 'USER_ROLE'],
  message: '{VALUE} no es un rol válido.'
};

// Crear Schema tipo Usuario
const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'El nombre es necesario.']
  },
  email: {
    type: String,
    required: [true, 'El correo es necesario'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria']
  },
  image: {
    type: String,
    required: false
  },
  role: {
    type: String,
    default: 'USER_ROLE',
    enum: validRoles 
  },
  state: {
    type: Boolean,
    default: true
  },
  google: {
    type: Boolean,
    default: false
  }
});

// Modificar Schema: Eliminar la propiedad "password" del objeto
userSchema.methods.toJSON = function () {
  let user = this;
  let userObject = user.toObject();
  delete userObject.password;
  // Devolver el objeto modificado
  return userObject;
}

// Plugin para validar campos con valores unicos.
userSchema.plugin(uniqueValidator, {
  message: '{PATH} debe ser único.'
});

// Exportar modelo tipo Usuario
module.exports = mongoose.model('User', userSchema);