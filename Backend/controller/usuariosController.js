// Model
import usuariosModel from "../models/usuariosModel.js";
// Importar SHA256 desde crypto-js
import cryptoJS from "crypto-js"; // Importar el módulo completo
const { SHA256 } = cryptoJS; // Extraer SHA256 del módulo
// Config
import config from "../config/config.js";
// Importar funciones de helpers
import { generateToken, verifyToken } from "../helpers/jwt.helper.js";
import { hashPassword, comparePassword } from "../helpers/bcrypt.helper.js";

// Controller
var usuariosController = {};

// Función para guardar usuarios
usuariosController.guardar = async function(request, response) {
    const post = {
        nombre: request.body.nombre,
        email: request.body.email,
        password: await hashPassword(request.body.password),
        estado: request.body.estado,
        rol: request.body.rol,
        telefono: request.body.telefono
    };

    // Validaciones
    const validaciones = [
        { campo: post.nombre, mensaje: "el campo nombre es obligatorio", maxLength: 20 },
        { campo: post.estado, mensaje: "el campo estado es obligatorio" },
        { campo: post.rol, mensaje: "el campo rol es obligatorio" },
        { campo: post.email, mensaje: "el campo email es obligatorio" },
        { campo: post.telefono, mensaje: "el campo telefono es obligatorio" },
        { campo: post.password, mensaje: "el campo password es obligatorio" }
    ];

    for (const validacion of validaciones) {
        if (!validacion.campo) {
            return response.json({ state: false, mensaje: validacion.mensaje });
        }

        if (validacion.maxLength && validacion.campo.length > validacion.maxLength) {
            return response.json({ state: false, mensaje: `el campo nombre no debe superar ${validacion.maxLength} caracteres` });
        }
    }

    // Validación de email
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(post.email)) {
        return response.json({ state: false, mensaje: "el campo email no es válido" });
    }

    // Validación de teléfono
    if (isNaN(post.telefono)) {
        return response.json({ state: false, mensaje: "el campo telefono no es un número" });
    }

    usuariosModel.existeEmail(post, function(res) {
        if (res.existe == 'si') {
            response.json({ state: false, mensaje: "el email ya esta registrado" });
            return false;
        } else {
            usuariosModel.guardar(post, function(respuesta) {
                response.json(respuesta);
            });
        }
    });
};

// Función para el login de usuarios
usuariosController.login = function(request, response) {
    const { email, password } = request.body;

    usuariosModel.existeEmail({ email }, function(res) {
        if (res.existe === 'no') {
            return response.json({ state: false, mensaje: "Email no registrado" });
        }

        usuariosModel.obtenerUsuarioPorEmail({ email }, async function(user) {
            if (!user || !(await comparePassword(password, user.password))) {
                return response.json({ state: false, mensaje: "Credenciales incorrectas" });
            }

            const token = generateToken({ userId: user._id, email: user.email });
            response.json({ state: true, token, mensaje: "Login exitoso" });
        });
    });
};

// Export
export default usuariosController;
