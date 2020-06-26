const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  description: {
    type: String,
    unique: true,
    required: [true, 'La descripcion es obligatoria']
  },
  user: {
    // Crear referencia hacia el 'ID' del modelo de Usuario
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('Category', categorySchema);