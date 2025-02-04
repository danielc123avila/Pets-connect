import mongoose from 'mongoose';

const petSchema = new mongoose.Schema({
  // Campos principales
  especie: {
    type: String,
    required: [true, 'La especie es obligatoria'],
    enum: {
      values: ['Perro', 'Gato', 'Otro'],
      message: 'Especie no válida ({VALUE})'
    }
  },
  sexo: {
    type: String,
    required: true,
    enum: ['Macho', 'Hembra', 'Desconocido']
  },
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true,
    maxlength: [50, 'Máximo 50 caracteres']
  },
  color: {
    type: String,
    required: true,
    maxlength: [30, 'Máximo 30 caracteres']
  },
  
  // Ubicación y fecha
  ultimaUbicacion: {
    type: String,
    required: [true, 'Debe especificar el lugar del extravío'],
    maxlength: [200, 'Máximo 200 caracteres']
  },
  fechaExtravio: {
    type: Date,
    required: true,
    validate: {
      validator: function(date) {
        return date <= new Date();
      },
      message: 'La fecha no puede ser futura'
    }
  },
  
  // Información de contacto
  contacto: {
    email: {
      type: String,
      required: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
    },
    celular: {
      type: String,
      required: true,
      match: [/^\+?\d{7,15}$/, 'Número inválido']
    }
  },
  
  // Multimedia y descripciones
  fotos: {
    type: [{
      url: String,
      thumbnail: String,
      descripcion: String
    }],
    validate: {
      validator: function(arr) {
        return arr.length >= 1 && arr.length <= 3;
      },
      message: 'Se requieren entre 1 y 3 fotos'
    }
  },
  descripcion: {
    type: String,
    required: true,
    maxlength: [500, 'Máximo 500 caracteres']
  },
  palabrasClave: {
    type: [String],
    validate: {
      validator: function(arr) {
        return arr.length <= 10;
      },
      message: 'Máximo 10 palabras clave'
    }
  },
  
  // Metadatos
  estado: {
    type: String,
    default: '',
    enum: ['Perdido', 'Encontrado', 'Adopción']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Pet', petSchema);
