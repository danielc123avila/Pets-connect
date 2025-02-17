// Model
import usuariosModel from "../models/usuariosModel.js";
//Importar SHA256 desde crypto-js
import cryptoJS from "crypto-js"; // Importar el módulo completo
const { SHA256 } = cryptoJS; // Extraer SHA256 del módulo
import { OAuth2Client } from 'google-auth-library';//Google AUth
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)// Crear el cliente de Google
import nodemailer from "nodemailer";// config/emailConfig.js
import config from "../config/config.js";
import dotenv from 'dotenv';
dotenv.config();


// Controller
var usuariosController = {}


function tiempoTranscurridoEnMinutos(fecha) {
    const ahora = new Date();
    const diferencia = ahora - new Date(fecha);
    return Math.floor(diferencia / 60000); // Convertir milisegundos a minutos
}

usuariosController.guardar = function(request, response) {
    const post = {
        nombre: request.body.nombre,
        email: request.body.email,
        password: request.body.password,
        estado: request.body.estado,
        rol: request.body.rol,
        telefono: request.body.telefono
    }

    // Validaciones
    const validaciones = [
        { campo: post.nombre, mensaje: "el campo nombre es obligatorio", maxLength: 20 },
        { campo: post.estado, mensaje: "el campo estado es obligatorio" },
        { campo: post.rol, mensaje: "el campo rol es obligatorio" },
        { campo: post.email, mensaje: "el campo email es obligatorio" },
        { campo: post.telefono, mensaje: "el campo telefono es obligatorio" },
        { campo: post.password, mensaje: "el campo password es obligatorio" }
    ]

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

usuariosController.registro = function (request, response) {
    const post = {
        nombre: request.body.nombre,
        email: request.body.email,
        telefono: request.body.telefono,
        password: request.body.password,

    }

    // Validaciones
    if (!post.nombre || post.nombre.length > 20) {
        return response.json({ state: false, mensaje: "El campo nombre es obligatorio y no debe superar 20 caracteres" })
    }

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(post.email)) {
        return response.json({ state: false, mensaje: "El campo email no es válido" })
    }

    if (!post.password) {
        return response.json({ state: false, mensaje: "El campo password es obligatorio" })
    }

    // Encriptar contraseña
    post.password = SHA256(post.password + config.palabraclave).toString()

    usuariosModel.existeEmail(post, function(res){

        if(res.existe == 'si'){
         response.json({state:false,mensaje: "el email ya esta registrado"})
         return false
        }
        else{
            //Variable para establecer numero aleatorio 
            var azar = 'G-' + Math.floor(Math.random() * (9999 - 1000) + 1000);
            //esta variable se esta usando para marcar como activo o desactivado un usuario
            post.azar = azar
            
            usuariosModel.registrar(post,function(respuesta){

                const transporter = nodemailer.createTransport ({
                    // Host es el servidor de correo que vamos a utilizar (google en este caso)
                    host: config.email.host,
                    //Puerto por el que sale el correo electronico, se configura en el config
                    port:config.email.port,
                    // Tiene valor de false
                    secure:false,
                    //TLS
                    requireTLS:true,
                    //Un obeto, contiene las credenciales de acceso al usuario de Gmail, se agrega en config
                    auth:{
                      user:config.email.user,
                      pass:config.email.pass
                    }
                })
                
                //Envio de coreo de verificacion
                var mailOptions = {
                    // De donde sale el correo
                    from:config.email.user,
                    // Para quien va el correo
                    to:post.email,
                    subject: "Verifica tu cuenta con el codigo: " + azar,
                    //Cuerpo del email que se envia para verificar el codigo
                    /*Linea 316 aca estamos llamando a la api de activacion y adicional llamanos el post de emil de la persona 
                    a la que se le envia el correo y adicional el numero de azar, al momento de dar click en activar 
                     se redirige al backend */
                    html:` <div style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">

                        <table width="100%" style="margin: 20px 0; padding: 0;">
                            <tr>
                                <td align="center">
                                    <table width="600" style="background-color: #ffffff; border: 1px solid #dddddd; border-radius: 5px; overflow: hidden;">
                                        <tr>
                                            <td style="padding: 20px 0; text-align: center; background-color: #4CAF50; color: white;">
                                                <h1 style="margin: 0; font-size: 24px;">Activación de Cuenta</h1>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 20px; text-align: center;">
                                                <p style="font-size: 16px; color: #333333;">Hola,</p>
                                                <p style="font-size: 16px; color: #333333;">Gracias por registrarte. Haz clic en el siguiente botón para activar tu cuenta:</p>

                                                <a href="http://localhost:4200/activar/${post.email}/${azar}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; font-size: 16px; border-radius: 5px; margin: 20px 0;">Activar Cuenta</a>
                                                
                                                <p style="font-size: 16px; color: #333333;">O utiliza el siguiente código de activación:</p>
                                                <p style="font-size: 18px; font-weight: bold; color: #4CAF50; background-color: #f9f9f9; padding: 10px; border-radius: 5px; display: inline-block;">${azar}</p>
                                                
                                                <p style="font-size: 14px; color: #333333; margin-top: 20px;">Si prefieres, también puedes copiar y pegar el siguiente enlace en tu navegador:</p>
                                                <p style="font-size: 14px; color: #4CAF50; background-color: #f9f9f9; padding: 10px; border-radius: 5px; word-break: break-all;">
                                                    http://localhost:4200/activar/${post.email}/${azar}
                                                </p>
                                                
                                                <p style="font-size: 14px; color: #666666;">Si no has solicitado esta cuenta, ignora este correo.</p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 10px; background-color: #f4f4f4; text-align: center; font-size: 12px; color: #666666;">
                                                &copy; 2024 GymGlam. Todos los derechos reservados.
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </div> `
                }   // envia correo con ciertas condiciones
                transporter.sendMail(mailOptions, (error,info) => {
                  if (error){
                    console.log(error)
                  }
                  else {
                    console.log(info)
                  }
                })
                response.json(respuesta)
            })
        }
    })
}

usuariosController.listar = function(request, response){
    usuariosModel.listar(null, function(respuesta){
        response.json(respuesta)
    })   
}

usuariosController.listarId = function(request, response){
    const post = {
        _id:request.body._id
    }
    if(post._id == null || post._id == undefined || post._id == ""){
        response.json ({state:false,mensaje:"el campo _id es obligatorio"})
        return false
    }
    usuariosModel.listarId(post, function(respuesta){
        response.json(respuesta)
    })
}

usuariosController.actualizar = function (request, response){

    const post = {
        _id:request.body._id,
        nombre:request.body.nombre,
        rol:request.body.rol,
        estado:request.body.estado,
        telefono:request.body.telefono,
    }

    // Validación de campos obligatorios
    const camposObligatorios = ['nombre', 'rol', 'estado', '_id'];
    for (const campo of camposObligatorios) {
    if (!post[campo]) {
        return response.json({ state: false, mensaje: `El campo ${campo} es obligatorio` });
        }
    }

    // Llamada al modelo para actualizar el usuario
    usuariosModel.actualizar(post, function(respuesta) {
        response.json(respuesta);
    })
}

usuariosController.login = function (request, response) {
    const post = {
        email: request.body.email,
        password: request.body.password
    }

    // Validación de campos obligatorios
    if (!post.email || !post.password) {
        return response.json({
        state: false,
            mensaje: !post.email ? "El campo email es obligatorio" : "El campo password es obligatorio"
        })
    }

    // Encriptar la contraseña
    post.password = SHA256(post.password + config.palabraclave).toString()

    // Validar el login
    usuariosModel.validaLogin(post, function (validacion) {
        const tiempo = tiempoTranscurridoEnMinutos(validacion.fechalogin)

        if (validacion.errorlogin < 3) {
            // Si el usuario puede hacer login
            usuariosModel.login(post, function (respuesta) {
                if (!respuesta.state) {
                    // Incrementar el contador de errores
                    post.cantidad = validacion.errorlogin + 1
                    usuariosModel.actualizarErrores(post, function (act) {
                        response.json(respuesta)
                    })
                } else {
                    // Actualizar la fecha del último login
                    usuariosModel.actualizarFechaLogin(post, function (actfecha) {
                        // Almacenar datos en la sesión
                        request.session.nombre = respuesta.data[0].nombre
                        request.session._id = respuesta.data[0]._id
                        request.session.ultimologin = respuesta.data[0].ultlogin
                        request.session.rol = respuesta.data[0].rol

                        response.json({ state: true, mensaje: "Bienvenido: " + respuesta.data[0].nombre })
                    })
                }
            })
        } else {
            // Usuario bloqueado
            if (tiempo < 2) {
                response.json({ state: false, mensaje: "Debe esperar al menos 2 minutos. Han transcurrido: " + tiempo + " minutos" })
            } else {
                // Reiniciar el contador de errores
                usuariosModel.login(post, function (respuesta) {
                    post.cantidad = 0;
                    usuariosModel.actualizarErrores(post, function (act) {
                        response.json(respuesta);
                    })
                })
            }
        }
    })
    
}

usuariosController.loginGoogle = function (request, response) {
    const { token } = request.body;

    // Validación del token
    if (!token) {
        return response.json({ state: false, mensaje: "El token de Google es obligatorio" });
    }

    // Verificar el token de Google
    client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
    })
    .then(ticket => {
        const payload = ticket.getPayload();
        const googleId = payload.sub;
        const email = payload.email;
        const nombre = payload.name;
        const avatar = payload.picture;

        // Buscar usuario por email o googleId
        usuariosModel.listarGoogleIdOEmail({ googleId, email }, function (resultado) {
            if (resultado.existe === 'no') {
                // Si el usuario no existe, crearlo
                const nuevoUsuario = {
                    nombre,
                    email,
                    googleId,
                    avatar,
                    estado: "1", // Activo
                    rol: "0" // Rol por defecto
                }

                usuariosModel.crearUsuarioG(nuevoUsuario, function (respuesta) {
                    if (respuesta.state) {
                        // Almacenar datos en la sesión
                        request.session.nombre = respuesta.usuario.nombre;
                        request.session._id = respuesta.usuario._id;
                        request.session.ultimologin = respuesta.usuario.ultlogin;
                        request.session.rol = respuesta.usuario.rol;

                        response.json({ state: true, mensaje: "Bienvenido: " + respuesta.usuario.nombre, usuario: respuesta.usuario });
                    } else {
                        response.json({ state: false, mensaje: "Error al crear el usuario" });
                    }
                });
            } else if (resultado.existe === 'si') {
                const usuario = resultado.usuario;

                // Si el usuario existe pero no tiene googleId, actualizarlo
                if (!usuario.googleId) {
                    usuariosModel.actualizarConGoogleId({ _id: usuario._id, googleId }, function (respuesta) {
                        if (respuesta.state) {
                            // Almacenar datos en la sesión
                            request.session.nombre = usuario.nombre;
                            request.session._id = usuario._id;
                            request.session.ultimologin = usuario.ultlogin;
                            request.session.rol = usuario.rol;

                            response.json({ state: true, mensaje: "Bienvenido: " + usuario.nombre, usuario });
                        } else {
                            response.json({ state: false, mensaje: "Error al actualizar el usuario" })
                        }
                    })
                } else {
                    // Si el usuario ya existe y tiene googleId
                    request.session.nombre = usuario.nombre;
                    request.session._id = usuario._id;
                    request.session.ultimologin = usuario.ultlogin;
                    request.session.rol = usuario.rol;

                    response.json({ state: true, mensaje: "Bienvenido: " + usuario.nombre, usuario })
                }
            } else {
                response.json({ state: false, mensaje: "Error al buscar el usuario" })
            }
        })
    })
    .catch(error => {
        console.error("Error en loginGoogle:", error);
        response.json({ state: false, mensaje: "Error al iniciar sesión con Google" })
    })
}

usuariosController.activar = function (request, response) {
    const post = {
        email: request.body.email,
        azar: request.body.azar
    }

    // Validación de campos obligatorios
    if (!post.email || !post.azar) {
        return response.json({
            state: false,
            mensaje: !post.email ? "El campo email es obligatorio" : "El campo azar es obligatorio"
        })
    }

    // Llamada al modelo para activar la cuenta
    usuariosModel.activar(post, function (respuesta) {
        response.json(respuesta);
    })
}

usuariosController.eliminar = function (request, response) {
    const post = { _id: request.body._id }

    if (!post._id) {
        return response.json({ state: false, mensaje: "El campo _id es obligatorio" })
    }
    usuariosModel.eliminar(post, function (respuesta) {
        response.json(respuesta)
    })
}

usuariosController.solicitarCodigo = function(request, response)
{
    const post = { email: request.body.email}
  
    if (!post.email) {
        return response.json({ state: false, mensaje: "El campo email es obligatorio" });
    }

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(post.email)) {
        return response.json({ state: false, mensaje: "El campo email no es válido" });
    }


    usuariosModel.existeEmail(post, function(res){

        if(res.existe == 'no'){
         response.json({state:false,mensaje: "El email no existe"})
         return false
        }
        else{
            //Variable para establecer numero aleatorio 
            var codigo = 'PASS-' + Math.floor(Math.random() * (9999 - 1000) + 1000);
            //esta variable se esta usando para marcar como activo o desactivado un usuario
            post.codigo = codigo
            
            usuariosModel.guardarCodigoRecuperacion(post,function(respuesta){

                const transporter = nodemailer.createTransport ({
                    // Host es el servidor de correo que vamos a utilizar (google en este caso)
                    host: config.email.host,
                    //Puerto por el que sale el correo electronico, se configura en el config
                    port:config.email.port,
                    // Tiene valor de false
                    secure:false,
                    //TLS
                    requireTLS:true,
                    //Un obeto, contiene las credenciales de acceso al usuario de Gmail, se agrega en config
                    auth:{
                      user:config.email.user,
                      pass:config.email.pass
                    }
                })
                
                //Envio de coreo de verificacion
                var mailOptions = {
                    // De donde sale el correo
                    from:config.email.user,
                    // Para quien va el correo
                    to:post.email,
                    subject: "Recuperacion de contraseña: " + codigo,
                    html:` <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
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
                    </div>`
                }   // envia correo con ciertas condiciones
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error("Error enviando correo:", error);
                    } else {
                        console.log("Correo enviado:", info.response);
                    }
                })

                response.json(respuesta)
            })
        }
    })

}

usuariosController.recuperarPass = function (request, response) {
    const post = {
        codigo: request.body.codigo,
        email: request.body.email,
        password: request.body.password,
    }

    // Validaciones
    if (!post.codigo) {
        return response.json({ state: false, mensaje: "El campo código es obligatorio" })
    }

    if (!post.email) {
        return response.json({ state: false, mensaje: "El campo email es obligatorio" })
    }

    // Validar formato del email
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(post.email)) {
        return response.json({ state: false, mensaje: "El campo email no es válido" })
    }

    if (!post.password) {
        return response.json({ state: false, mensaje: "El campo password es obligatorio" })
    }

    // Encriptar la contraseña
    post.password = SHA256(post.password + config.palabraclave).toString()

    // Llamar al modelo para actualizar la contraseña
    usuariosModel.recuperarPass(post, function (respuesta) {
        if (respuesta.state) {
            return response.json({ state: true, mensaje: "Se ha cambiado el password satisfactoriamente" })
        } else {
            return response.json({ state: false, mensaje: "Se ha presentado un error" })
        }
    })
}

// Export
export default usuariosController
