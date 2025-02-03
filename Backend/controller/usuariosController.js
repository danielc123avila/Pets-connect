// Model
import usuariosModel from "../models/usuariosModel.js";
//Importar SHA256 desde crypto-js
import cryptoJS from "crypto-js"; // Importar el módulo completo
const { SHA256 } = cryptoJS; // Extraer SHA256 del módulo
// Config
import config from "../config/config.js";

// Controller
var usuariosController = {};

usuariosController.guardar = function(request, response) {
    const post = {
        nombre: request.body.nombre,
        email: request.body.email,
        password: request.body.password,
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

    // Encriptar contraseña
    post.password = SHA256(post.password + config.palabraclave). toString();

    usuariosModel.existeEmail(post, function(res){

        if(res.existe == 'si'){
         response.json({state:false,mensaje: "el email ya esta registrado"})
         return false
        }
        else{

            usuariosModel.guardar(post,function(respuesta){
                response.json(respuesta)
            })
        }
    })
}

// Export
export default usuariosController;
