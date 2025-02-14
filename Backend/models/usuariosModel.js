// import { hashPassword, comparePassword } from "../helpers/bcrypt.helper.js";
import mongoose from "mongoose";
import bycrypt from "bcryptjs";

const { Schema } = mongoose;

// Define el esquema
const usuariosSchema = new Schema({
  nombre: String,
  email: String,
  password: String,
  telefono: Number,
  errorlogin: { type: Number, default: 0 },
  fechalogin: { type: Date, default: Date.now },
  azar: String,
  estado: { type: String, default: "0" },
  codepass: String,
  ultlogin: Date,
  rol: String,
});

usuariosSchema.pre("save", async function (next) {
  const passwordHash = await bycrypt.hash(this.password, 10);
  this.password = passwordHash;
  next();
});
// Crea el modelo
const Usuarios = mongoose.model("Usuarios", usuariosSchema);

// Define el objeto usuariosModel
const usuariosModel = {};

// Función para guardar datos de usuario con contraseña hasheada
usuariosModel.guardar = async function (post) {
  try {
    const hashedPassword = await post.password;
    const instancia = new Usuarios({
      nombre: post.nombre,
      email: post.email,
      password: hashedPassword,
      telefono: post.telefono,
      rol: post.rol,
    });

    const respuesta = await instancia.save();
    return { state: true, mensaje: "Usuario guardado", data: respuesta };
  } catch (error) {
    console.error(error);
    return { state: false, mensaje: "Se presentó un error", error };
  }
};

// Función para verificar si un email ya está registrado
usuariosModel.existeEmail = async function (post) {
  try {
    const usuario = await Usuarios.findOne({ email: post.email });
    return { existe: usuario ? "si" : "no" };
  } catch (error) {
    console.error(error);
    return { existe: "no", error };
  }
};

// Función para registrar un nuevo usuario
usuariosModel.registrar = async function (post) {
  try {
    const existe = await usuariosModel.existeEmail(post);
    if (existe.existe === "si") {
      return { state: false, mensaje: "El email ya está registrado" };
    }

    const azar = "G-" + Math.floor(Math.random() * (9999 - 1000) + 1000);
    post.azar = azar;

    const respuesta = await usuariosModel.guardar(post);
    return respuesta;
  } catch (error) {
    console.error("Error en el registro:", error);
    return { state: false, mensaje: "Error interno del servidor", error };
  }
};

// Función para obtener un usuario por email
usuariosModel.obtenerUsuarioPorEmail = async function ({ email }) {
  try {
    const user = await Usuarios.findOne({ email: email });
    return user; // Retorna el usuario encontrado (o null si no existe)
  } catch (error) {
    console.error("Error en obtenerUsuarioPorEmail:", error);
    throw error;
  }
};

// Función para validar el login
usuariosModel.validaLogin = async function (post) {
  try {
    const user = await Usuarios.findOne({ email: post.email });
    return user || { errorlogin: 0, fechalogin: new Date() };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

usuariosModel.login = async function (post) {
  try {
    const user = await Usuarios.findOne({ email: post.email });
    if (!user) {
      return { state: false, mensaje: "Usuario no encontrado" };
    }

    const passwordMatch = await comparePassword(post.password, user.password);
    if (passwordMatch) {
      return { state: true, data: user };
    } else {
      return { state: false, mensaje: "Contraseña incorrecta" };
    }
  } catch (error) {
    console.error("Error en login:", error);
    throw error;
  }
};

// Función para actualizar los errores de login
usuariosModel.actualizarErrores = async function (post) {
  try {
    const res = await Usuarios.updateOne(
      { email: post.email },
      { $set: { errorlogin: post.cantidad } }
    );
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Función para actualizar la fecha de login
usuariosModel.actualizarFechaLogin = async function (post) {
  try {
    const user = await Usuarios.findOneAndUpdate(
      { email: post.email },
      { $set: { fechalogin: new Date() } },
      { new: true }
    );
    return { state: true, data: user };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Función para listar todos los usuarios (sin contraseñas)
usuariosModel.listar = async function () {
  try {
    const usuarios = await Usuarios.find({}, { password: 0 });
    return { state: true, datos: usuarios };
  } catch (error) {
    console.error(error);
    return { state: false, datos: [], error, mensaje: "Se presentó un error" };
  }
};

// Función para listar un usuario por ID (sin contraseña)
usuariosModel.listarId = async function (post) {
  try {
    const usuario = await Usuarios.find({ _id: post._id }, { password: 0 });
    return { state: true, datos: usuario };
  } catch (error) {
    console.error(error);
    return { state: false, datos: [], error, mensaje: "Se presentó un error" };
  }
};

// Función para actualizar un usuario
usuariosModel.actualizar = async function (post) {
  try {
    const respuesta = await Usuarios.findByIdAndUpdate(
      post._id,
      {
        nombre: post.nombre,
        rol: post.rol,
        estado: post.estado,
        telefono: post.telefono,
      },
      { new: true }
    );

    return { state: true, mensaje: "Elemento actualizado", data: respuesta };
  } catch (error) {
    console.error(error);
    return { state: false, mensaje: "Error al actualizar", error };
  }
};

// Función para activar una cuenta
usuariosModel.activar = async function (post) {
  try {
    const respuesta = await Usuarios.findOneAndUpdate(
      { email: post.email, azar: post.azar },
      { estado: "1" },
      { new: true }
    );

    if (!respuesta) {
      return {
        state: false,
        mensaje: "Su email y código no son aptos para activar la cuenta",
      };
    } else {
      return { state: true, mensaje: "Cuenta activada", data: respuesta };
    }
  } catch (error) {
    console.error(error);
    return { state: false, mensaje: "Error al activar la cuenta", error };
  }
};

// Función para eliminar un usuario
usuariosModel.eliminar = async function (post) {
  try {
    await Usuarios.findByIdAndDelete(post._id);
    return { state: true, mensaje: "Elemento eliminado" };
  } catch (error) {
    console.error(error);
    return { state: false, mensaje: "Error al eliminar", error };
  }
};

// Función para guardar el código de recuperación de contraseña
usuariosModel.guardarCodigoRecuperacion = async function (post) {
  try {
    await Usuarios.findOneAndUpdate(
      { email: post.email },
      { codepass: post.codigo }
    );
    return {
      state: true,
      mensaje: "Hemos enviado un correo electrónico, por favor verifica.",
    };
  } catch (error) {
    console.error(error);
    return { state: false, mensaje: "Error al generar código", error };
  }
};

// Función para recuperar la contraseña
usuariosModel.recuperarPass = async function (post) {
  try {
    const respuesta = await Usuarios.findOneAndUpdate(
      { email: post.email, codepass: post.codigo },
      { password: await hashPassword(post.password) },
      { new: true }
    );

    if (!respuesta) {
      return {
        state: false,
        mensaje: "Código incorrecto o email no encontrado",
      };
    } else {
      return {
        state: true,
        mensaje: "Contraseña actualizada correctamente",
        data: respuesta,
      };
    }
  } catch (error) {
    console.error("Error en recuperarPass:", error);
    return {
      state: false,
      mensaje: "Error al actualizar la contraseña",
      error,
    };
  }
};

// Función para actualizar la contraseña de un usuario
usuariosModel.actualizarContraseña = async function (id, nuevaContraseña) {
  try {
    const hashedPassword = await hashPassword(nuevaContraseña);
    await Usuarios.findByIdAndUpdate(id, { password: hashedPassword });
    return { state: true, mensaje: "Contraseña actualizada correctamente" };
  } catch (error) {
    console.error("Error al actualizar la contraseña:", error);
    return {
      state: false,
      mensaje: "Error al actualizar la contraseña",
      error,
    };
  }
};

export default usuariosModel;
