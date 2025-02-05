import mongoose from "mongoose";

const petSchema = new mongoose.Schema(
  {
    // Información básica
    especie: {
      type: String,
      required: [true, "La especie es obligatoria"],
      enum: {
        values: ["Perro", "Gato", "Otro"],
        message: "Especie inválida. Opciones válidas: Perro, Gato, Otro",
      },
      trim: true,
    },
    sexo: {
      type: String,
      required: [true, "El sexo es obligatorio"],
      enum: ["Macho", "Hembra", "Desconocido"],
    },
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
      maxlength: [50, "El nombre no puede exceder los 50 caracteres"],
    },
    color: {
      type: String,
      required: true,
      maxlength: 30,
    },
    raza: {
      type: String,
      required: true,
      maxlength: 50,
    },
    // Datos de contacto (campos planos)
    email: {
      type: String,
      required: [true, "El email es obligatorio"],
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Email inválido",
      ],
    },
    celular: {
      type: String,
      required: [true, "El número celular es obligatorio"],
      validate: {
        validator: function (v) {
          return /^\+?[1-9]\d{7,14}$/.test(v);
        },
        message: "Formato inválido. Ejemplo válido: +5491144556677",
      },
    },

    // Ubicación y fecha
    ultimaUbicacion: {
      type: String,
      required: [true, "La última ubicación es obligatoria"],
      maxlength: 100,
    },
    fechaExtravio: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value <= new Date();
        },
        message: "La fecha de extravío no puede ser futura",
      },
    },

    // Descripción y metadata
    descripcion: {
      type: String,
      maxlength: [500, "La descripción no puede exceder 500 caracteres"],
    },
    palabrasClave: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],

    // Manejo de archivos
    fotos: [
      {
        url: {
          type: String,
          required: true,
        },
        thumbnail: String,
        descripcion: {
          type: String,
          default: "Foto de la mascota",
          maxlength: 100,
        },
      },
    ],

    // Metadata automática
    estado: {
      type: String,
      enum: ["Perdido", "Encontrado", "en adopcion"],
    },
  },
  {
    timestamps: true,
  }
);

// Índice para búsquedas
petSchema.index({
  nombre: "text",
  descripcion: "text",
  palabrasClave: "text",
});

export default mongoose.model("Pet", petSchema);
