// Model
import usuariosModel from "../models/usuariosModel.js";
//  Importar SHA256 desde crypto-js
// import cryptoJS from "crypto-js"; // Importar el módulo completo
// const { SHA256 } = cryptoJS; // Extraer SHA256 del módulo
// config/emailConfig.js
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
// Config
import config from "../config/config.js";
// import verifyToken from "../helpers/jwt.helper.js";
// Importar funciones de helpers
// import { verifyToken } from "../helpers/jwt.helper.js";

// import { hashPassword, comparePassword } from "../helpers/bcrypt.helper.js";

const usuariosController = {};

// Función para calcular el tiempo transcurrido en minutos
function tiempoTranscurridoEnMinutos(fecha) {
  const ahora = new Date();
  const diferencia = ahora - new Date(fecha);
  return Math.floor(diferencia / 60000); // Convertir milisegundos a minutos
}

// Función para guardar usuarios
usuariosController.guardar = async function (request, response) {
  console.log("Guardar usuario");
  const post = {
    nombre: request.body.nombre,
    email: request.body.email,
    password:request.body.password,
    estado: request.body.estado,
    rol: request.body.rol,
    telefono: request.body.telefono,
  };

  console.log("Contraseña hasheada:", post.password);

  // Validaciones
  const validaciones = [
    {
      campo: post.nombre,
      mensaje: "el campo nombre es obligatorio",
      maxLength: 20,
    },
    { campo: post.estado, mensaje: "el campo estado es obligatorio" },
    { campo: post.rol, mensaje: "el campo rol es obligatorio" },
    { campo: post.email, mensaje: "el campo email es obligatorio" },
    { campo: post.telefono, mensaje: "el campo telefono es obligatorio" },
    { campo: post.password, mensaje: "el campo password es obligatorio" },
  ];

  for (const validacion of validaciones) {
    if (!validacion.campo) {
      return response.json({ state: false, mensaje: validacion.mensaje });
    }

    if (
      validacion.maxLength &&
      validacion.campo.length > validacion.maxLength
    ) {
      return response.json({
        state: false,
        mensaje: `el campo nombre no debe superar ${validacion.maxLength} caracteres`,
      });
    }
  }

  // Validación de email
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(post.email)) {
    return response.json({
      state: false,
      mensaje: "el campo email no es válido",
    });
  }

  // Validación de teléfono
  if (isNaN(post.telefono)) {
    return response.json({
      state: false,
      mensaje: "el campo telefono no es un número",
    });
  }

  try {
    // Verificar si el email ya está registrado
    const existe = await usuariosModel.existeEmail(post);
    if (existe.existe === "si") {
      return response.json({
        state: false,
        mensaje: "el email ya está registrado",
      });
    }

    // Guardar el usuario
    const respuesta = await usuariosModel.guardar(post);
    response.json(respuesta);
  } catch (error) {
    console.error("Error en guardar:", error);
    response.json({ state: false, mensaje: "Error interno del servidor" });
  }
};

// Función para el login
usuariosController.login = async function (request, response) {
  const { email, password } = request.body;

  if (!email || !password) {
    return response
      .status(400)
      .json({ state: false, mensaje: "Email y contraseña son obligatorios" });
  }

  try {
    const user = await usuariosModel.obtenerUsuarioPorEmail({ email });
    if (!user) {
      return response
        .status(404)
        .json({ state: false, mensaje: "Email no registrado" });
    }

    console.log("Contraseña proporcionada:", password);
    console.log("Contraseña hasheada en la base de datos:", user.password);

    // const passwordMatch = await comparePassword(password, user.password);
    // if (!passwordMatch) {
    //   console.log("Contraseña incorrecta para el usuario:", user.email);
    //   return response
    //     .status(401)
    //     .json({ state: false, mensaje: "Contraseña incorrecta" });
    // }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    response.json({ state: true, token, mensaje: "Login exitoso" });
  } catch (error) {
    console.error("Error en login:", error);
    response
      .status(500)
      .json({ state: false, mensaje: "Error interno del servidor" });
  }
};

// Función para registrar un nuevo usuario
usuariosController.registro = async function (request, response) {
  const post = {
    nombre: request.body.nombre,
    email: request.body.email,
    password: request.body.password,
  };

  // Validaciones
  if (!post.nombre || post.nombre.length > 20) {
    return response.json({
      state: false,
      mensaje: "El campo nombre es obligatorio y no debe superar 20 caracteres",
    });
  }

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(post.email)) {
    return response.json({
      state: false,
      mensaje: "El campo email no es válido",
    });
  }

  if (!post.password) {
    return response.json({
      state: false,
      mensaje: "El campo password es obligatorio",
    });
  }

  try {

    // Guardar el usuario en la base de datos
    const respuesta = await usuariosModel.registrar(post);
    response.json(respuesta);
  } catch (error) {
    console.error("Error en registro:", error);
    response.json({ state: false, mensaje: "Error interno del servidor" });
  }
};

// Función para listar todos los usuarios
usuariosController.listar = async function (request, response) {
  try {
    const respuesta = await usuariosModel.listar();
    response.json(respuesta);
  } catch (error) {
    console.error("Error en listar:", error);
    response.json({ state: false, mensaje: "Error interno del servidor" });
  }
};

// Función para listar un usuario por ID
usuariosController.listarId = async function (request, response) {
  const post = {
    _id: request.body._id,
  };

  if (!post._id) {
    return response.json({
      state: false,
      mensaje: "el campo _id es obligatorio",
    });
  }

  try {
    const respuesta = await usuariosModel.listarId(post);
    response.json(respuesta);
  } catch (error) {
    console.error("Error en listarId:", error);
    response.json({ state: false, mensaje: "Error interno del servidor" });
  }
};

// Función para actualizar un usuario
usuariosController.actualizar = async function (request, response) {
  const post = {
    _id: request.body._id,
    nombre: request.body.nombre,
    rol: request.body.rol,
    estado: request.body.estado,
    telefono: request.body.telefono,
  };

  // Validación de campos obligatorios
  const camposObligatorios = ["nombre", "rol", "estado", "_id"];
  for (const campo of camposObligatorios) {
    if (!post[campo]) {
      return response.json({
        state: false,
        mensaje: `El campo ${campo} es obligatorio`,
      });
    }
  }

  try {
    const respuesta = await usuariosModel.actualizar(post);
    response.json(respuesta);
  } catch (error) {
    console.error("Error en actualizar:", error);
    response.json({ state: false, mensaje: "Error interno del servidor" });
  }
};

// Función para activar una cuenta
usuariosController.activar = async function (request, response) {
  const post = {
    email: request.body.email,
    azar: request.body.azar,
  };

  // Validación de campos obligatorios
  if (!post.email || !post.azar) {
    return response.json({
      state: false,
      mensaje: !post.email
        ? "El campo email es obligatorio"
        : "El campo azar es obligatorio",
    });
  }

  try {
    const respuesta = await usuariosModel.activar(post);
    response.json(respuesta);
  } catch (error) {
    console.error("Error en activar:", error);
    response.json({ state: false, mensaje: "Error interno del servidor" });
  }
};

// Función para eliminar un usuario
usuariosController.eliminar = async function (request, response) {
  const post = { _id: request.body._id };

  if (!post._id) {
    return response.json({
      state: false,
      mensaje: "El campo _id es obligatorio",
    });
  }

  try {
    const respuesta = await usuariosModel.eliminar(post);
    response.json(respuesta);
  } catch (error) {
    console.error("Error en eliminar:", error);
    response.json({ state: false, mensaje: "Error interno del servidor" });
  }
};

// Función para solicitar código de recuperación
usuariosController.solicitarCodigo = async function (request, response) {
  const post = { email: request.body.email };

  if (!post.email) {
    return response.json({
      state: false,
      mensaje: "El campo email es obligatorio",
    });
  }

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(post.email)) {
    return response.json({
      state: false,
      mensaje: "El campo email no es válido",
    });
  }

  try {
    const existe = await usuariosModel.existeEmail(post);
    if (existe.existe === "no") {
      return response.json({ state: false, mensaje: "El email no existe" });
    }

    const codigo = "PASS-" + Math.floor(Math.random() * (9999 - 1000) + 1000);
    post.codigo = codigo;

    const respuesta = await usuariosModel.guardarCodigoRecuperacion(post);

    const transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: false,
      requireTLS: true,
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      },
    });

    const mailOptions = {
      from: config.email.user,
      to: post.email,
      subject: "Recuperacion de contraseña: " + codigo,
      html: ` <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
                        <h2 style="color: #333333; text-align: center;">Recuperación de contraseña</h2>
                        <p style="color: #555555; font-size: 16px; line-height: 1.6;">
                            Hola, 
                        </p>
                        <p style="color: #555555; font-size: 16px; line-height: 1.6;">
                            Has solicitado restablecer tu contraseña. Para continuar con el proceso, usa el siguiente código de recuperación:
                        </p>
                        <p style="text-align: center;">
                            <span style="display: inline-block; background-color: #f7f7f7; border: 1px solid #ddd; padding: 10px 20px; font-size: 18px; font-weight: bold; color: #333333; letter-spacing: 2px;">
                                ${codigo}
                            </span>
                        </p>
                        <p style="color: #555555; font-size: 16px; line-height: 1.6;">
                            Si no solicitaste este cambio, por favor ignora este correo. Tu contraseña no se modificará hasta que uses este código en nuestra página web.
                        </p>
                        <p style="color: #555555; font-size: 16px; line-height: 1.6;">
                            Gracias,<br>
                            El equipo de Soporte
                        </p>
                        <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 20px 0;">
                        <p style="color: #999999; font-size: 12px; text-align: center;">
                            Este correo fue enviado de forma automática. Por favor, no respondas a este mensaje.
                        </p>
                    </div>
                    </div>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error enviando correo:", error);
      } else {
        console.log("Correo enviado:", info.response);
      }
    });

    response.json(respuesta);
  } catch (error) {
    console.error("Error en solicitarCodigo:", error);
    response.json({ state: false, mensaje: "Error interno del servidor" });
  }
};

// Función para recuperar la contraseña
usuariosController.recuperarPass = async function (request, response) {
  const post = {
    codigo: request.body.codigo,
    email: request.body.email,
    password: request.body.password,
  };

  // Validaciones
  if (!post.codigo) {
    return response.json({
      state: false,
      mensaje: "El campo código es obligatorio",
    });
  }

  if (!post.email) {
    return response.json({
      state: false,
      mensaje: "El campo email es obligatorio",
    });
  }

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(post.email)) {
    return response.json({
      state: false,
      mensaje: "El campo email no es válido",
    });
  }

  if (!post.password) {
    return response.json({
      state: false,
      mensaje: "El campo password es obligatorio",
    });
  }

  try {
    // Hashear la nueva contraseña
    post.password = await hashPassword(post.password);

    // Llamar al modelo para actualizar la contraseña
    const respuesta = await usuariosModel.recuperarPass(post);
    response.json(respuesta);
  } catch (error) {
    console.error("Error en recuperarPass:", error);
    response.json({ state: false, mensaje: "Error interno del servidor" });
  }
};

// Export
export default usuariosController;
