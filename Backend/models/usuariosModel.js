const usuariosModel = {};
import mongoose from "mongoose";
const { Schema } = mongoose;

// Define the schema
const usuariosSchema = new Schema({
  nombre: String,
  email: String,
  password: String,
  telefono: Number,
  errorlogin: { type: Number, default: 0 },
  fechalogin: { type: Date, default: Date.now },
  azar: String,
  estado: String,
  codepass: String,
  ultlogin: Date,
  rol: String,
  azar: String,
  googleId: String,
});

// Create the model
const Usuarios = mongoose.model("Usuarios", usuariosSchema);

// Function to save user data
usuariosModel.guardar = function (post, callback) {
  const instancia = new Usuarios({
    nombre: post.nombre,
    email: post.email,
    password: post.password,
    estado: post.estado,
    telefono: post.telefono,
    rol: post.rol,
  });

  // Save the information
  instancia
    .save()
    .then((respuesta) => {
      console.log(respuesta);
      return callback({ state: true, mensaje: "Usuario guardado" });
    })

    .catch((error) => {
      console.error(error);
      return callback({ state: false, mensaje: "Se presentó un error" });
    });
};

usuariosModel.crearUsuarioG = function (post, callback) {
  const instancia = new Usuarios({
    nombre: post.nombre,
    email: post.email,
    telefono: post.telefono || 0,
    rol: post.rol || 0,
    googleId: post.googleId,
    estado: "1",
  });
  instancia
    .save()
    .then((respuesta) => {
      console.log("Usuario creado:", respuesta);
      return callback({
        state: true,
        mensaje: "Usuario guardado",
        usuario: respuesta,
      });
    })
    .catch((error) => {
      console.error("Error al guardar el usuario:", error);
      return callback({
        state: false,
        mensaje: "Error al guardar el usuario",
      });
    });
};
usuariosModel.buscarPorEmail = async function (email) {
  try {
    const usuario = await Usuarios.findOne({ email: email.toLowerCase() });
    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }
    return usuario;
  } catch (err) {
    throw new Error(err.message);
  }
};

usuariosModel.registrar = function (post, callback) {
  const instancia = new Usuarios({
    nombre: post.nombre,
    email: post.email,
    password: post.password,
    telefono: post.telefono || 0,
    estado: post.estado || 0,
    rol: post.rol || 0,
    azar: post.azar,
  });

  instancia
    .save()
    .then((respuesta) => {
      console.log(respuesta);
      return callback({ state: true, mensaje: "usuario guardado" });
    })
    .catch((error) => {
      console.log(error);
      return callback({ state: false, mensaje: "se presento un error" });
    });
};

usuariosModel.existeEmail = function (post, callback) {
  Usuarios.findOne({ email: post.email }, {}).then((respuesta) => {
    if (respuesta == null) {
      return callback({ existe: "no" });
    } else {
      return callback({ existe: "si" });
    }
  });
};

usuariosModel.listarGoogleIdOEmail = function (post, callback) {
  Usuarios.findOne({
    $or: [{ googleId: post.googleId }, { email: post.email }],
  })
    .then((usuario) => {
      if (!usuario) {
        return callback({ existe: "no", usuario: null });
      }

      // Si el usuario existe, actualizar ultlogin
      usuario.ultlogin = new Date();
      usuario
        .save()
        .then((usuarioActualizado) => {
          return callback({ existe: "si", usuario: usuarioActualizado });
        })
        .catch((error) => {
          console.error("Error al actualizar ultlogin:", error);
          return callback({ existe: "error", usuario: null });
        });
    })
    .catch((error) => {
      console.error(error);
      return callback({ existe: "error", usuario: null });
    });
};

usuariosModel.listar = function (post, callback) {
  Usuarios.find({}, { password: 0 })
    .then((respuesta) => {
      return callback({ state: true, datos: respuesta });
    })
    .catch((error) => {
      return callback({
        state: false,
        datos: [],
        error: error,
        mensaje: "se presento un error",
      });
    });
};

usuariosModel.listarId = function (post, callback) {
  Usuarios.find({ _id: post._id }, { password: 0 })
    .then((respuesta) => {
      return callback({ state: true, datos: respuesta });
    })
    .catch((error) => {
      return callback({
        state: false,
        datos: [],
        error: error,
        mensaje: "se presento un error",
      });
    });
};

usuariosModel.actualizar = function (post, callback) {
  Usuarios.findByIdAndUpdate(post._id, {
    nombre: post.nombre,
    rol: post.rol,
    estado: post.estado,
    telefono: post.telefono,
  })
    .then((respuesta) => {
      return callback({ state: true, mensaje: "Elemento actualizado" });
      console.log(respuesta);
    })
    .catch((error) => {
      return callback({
        state: false,
        mensaje: "Error al actualizar",
        error: error,
      });
    });
};

usuariosModel.actualizarConGoogleId = function (post, callback) {
  Usuarios.findByIdAndUpdate(post._id, { googleId: post.googleId })
    .then((respuesta) => {
      return callback({
        state: true,
        mensaje: "Elemento actualizado",
        usuario: respuesta,
      });
    })
    .catch((error) => {
      console.error(error);
      return callback({
        state: false,
        mensaje: "Error al actualizar",
        error: error,
      });
    });
};

usuariosModel.validaLogin = function (post, callback) {
  Usuarios.findOne({ email: post.email }, { fechalogin: 1, errorlogin: 1 })
    .then((respuesta) => {
      return callback(respuesta);
    })
    .catch((error) => {
      return callback(error);
    });
};

usuariosModel.actualizarErrores = function (post, callback) {
  Usuarios.findOneAndUpdate(
    { email: post.email },
    {
      errorlogin: post.cantidad,
      fechalogin: new Date(),
    }
  )
    .then((respuesta) => {
      console.log(respuesta);
      return callback({ state: true, mensaje: "Elemento Actualizado" });
    })
    .catch((error) => {
      return callback({
        state: false,
        mensaje: "Error al actualizar",
        error: error,
      });
    });
};

usuariosModel.actualizarFechaLogin = function (post, callback) {
  Usuarios.findOneAndUpdate(
    { email: post.email, password: post.password },
    {
      ultlogin: new Date(),
    }
  )
    .then((respuesta) => {
      return callback({ state: true, mensaje: "Elemento actualizado" });
      console.log(respuesta);
    })
    .catch((error) => {
      return callback({
        state: false,
        mensaje: "Error al actualizar",
        error: error,
      });
    });
};

usuariosModel.login = function (post, callback) {
  //Estado nos dice que la cuenta se debio haber activado si esta en uno
  Usuarios.find({ email: post.email, password: post.password, estado: "1" }, {})
    .then((respuesta) => {
      if (respuesta.length == 1) {
        return callback({
          state: true,
          mensaje: "Bienvenido: " + respuesta[0].nombre,
          data: respuesta,
        });
      } else {
        return callback({
          state: false,
          datos: [],
          error: error,
          mensaje: "se presento un error al ingresar",
        });
      }
    })
    .catch((error) => {
      return callback({
        state: false,
        mensaje: "Credenciales Invalidas o cuenta inactiva",
      });
    });
};

usuariosModel.activar = function (post, callback) {
  Usuarios.findOneAndUpdate(
    { email: post.email, azar: post.azar }, // Criterios de búsqueda

    { estado: "1" } // Campos a actualizar
  )
    .then((respuesta) => {
      if (!respuesta) {
        return callback({
          state: false,
          mensaje: "Su email y código no son aptos para activar la cuenta",
        });
      } else {
        return callback({ state: true, mensaje: "Cuenta activada" });
      }
    })
    .catch((error) => {
      return callback({
        state: false,
        mensaje: "Error al activar la cuenta",
        error: error,
      });
    });
};

usuariosModel.eliminar = function (post, callback) {
  Usuarios.findByIdAndDelete(post._id)
    .then(() => {
      callback({ state: true, mensaje: "Elemento eliminado" });
    })
    .catch((error) => {
      callback({ state: false, mensaje: "Error al eliminar", error });
    });
};

usuariosModel.guardarCodigoRecuperacion = function (post, callback) {
  Usuarios.findOneAndUpdate({ email: post.email }, { codepass: post.codigo })
    .then(() => {
      callback({
        state: true,
        mensaje: "Hemos enviado un correo electrónico, por favor verifica.",
      });
    })
    .catch((error) => {
      callback({ state: false, mensaje: "Error al generar código", error });
    });
};

usuariosModel.recuperarPass = function (post, callback) {
  Usuarios.findOneAndUpdate(
    { email: post.email, codepass: post.codigo },
    { password: post.password }
  )
    .then((respuesta) => {
      if (!respuesta) {
        callback({
          state: false,
          mensaje: "Código incorrecto o email no encontrado",
        });
      } else {
        callback({
          state: true,
          mensaje: "Contraseña actualizada correctamente",
        });
      }
    })
    .catch((error) => {
      console.error("Error en recuperarpass:", error);
      callback({
        state: false,
        mensaje: "Error al actualizar la contraseña",
        error,
      });
    });
};

// Export the function and model
export default usuariosModel;
