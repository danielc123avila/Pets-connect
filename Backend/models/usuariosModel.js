const usuariosModel = {};
import mongoose from "mongoose";
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
    estado: { type: String, default: '0' },
    codepass: String,
    ultlogin: Date,
    rol: String
});

// Crea el modelo
const Usuarios = mongoose.model("Usuarios", usuariosSchema);

// Función para guardar datos de usuario
usuariosModel.guardar = function (post, callback) {
    const instancia = new Usuarios({
        nombre: post.nombre,
        email: post.email,
        password: post.password,
        telefono: post.telefono,
        rol: post.rol
    });

    instancia.save()          // Guarda la información
        .then((respuesta) => {
            console.log(respuesta);
            return callback({ state: true, mensaje: "Usuario guardado" })
        })

        .catch((error) => {
            console.error(error);
            return callback({ state: false, mensaje: "Se presentó un error" })
        })
}

// Función para verificar si un email ya existe
usuariosModel.existeEmail = function (post, callback) {
    Usuarios.findOne({ email: post.email }, {}).then((respuesta) => {
        if (respuesta == null) {
            return callback({ existe: 'no' });
        } else {
            return callback({ existe: 'si' });
        }
    });
};

// Función para obtener un usuario por email y contraseña
usuariosModel.obtenerUsuarioPorEmail = function (post, callback) {
    Usuarios.findOne({ email: post.email })
        .then((usuario) => {
            callback(usuario);
        })
        .catch((error) => {
            console.error(error);
            callback(null);
        });
};

// Función para listar todos los usuarios (sin contraseñas)
usuariosModel.listar = function (post, callback) {
    Usuarios.find({}, { password: 0 })
        .then((respuesta) => {
            return callback({ state: true, datos: respuesta })
    })
        .catch((error) => {
            return callback({ state: false, datos: [], error: error, mensaje: "se presento un error" })
        })
}

// Función para listar un usuario por ID (sin contraseña)
usuariosModel.listarId = function (post, callback) {
    Usuarios.find({ _id: post._id }, { password: 0 })
        .then((respuesta) => {
            return callback({ state: true, datos: respuesta })
    })
        .catch((error) => {
            return callback({ state: false, datos: [], error: error, mensaje: "se presento un error" })
        })
}

// Función para actualizar un usuario
usuariosModel.actualizar = function (post, callback) {
    Usuarios.findByIdAndUpdate(post._id,
        {
            nombre: post.nombre,
            rol: post.rol,
            estado: post.estado,
            telefono: post.telefono

        }).then((respuesta) => {
            console.log(respuesta)
            return callback({ state: true, mensaje: "Elemento actualizado" })
            
        })
        .catch((error) => {
            return callback({ state: false, mensaje: "Error al actualizar", error: error })
        })
}

// Función para actualizar los errores de login
usuariosModel.actualizarErrores = function (post, callback) {
    Usuarios.findOneAndUpdate({ email: post.email }, {
        errorlogin: post.cantidad,
        fechalogin: new Date()
    })
        .then((respuesta) => {
        console.log(respuesta)
            return callback({ state: true, mensaje: "Elemento Actualizado" })
    })
        .catch((error) => {
            return callback({ state: false, mensaje: "Error al actualizar", error: error })
    })
}

// Función para activar una cuenta
usuariosModel.activar = function (post, callback) {
    Usuarios.findOneAndUpdate({ email: post.email, azar: post.azar }, // Criterios de búsqueda
        { estado: "1" } // Campos a actualizar
    )
        .then((respuesta) => {
            if (!respuesta) {
                return callback({ state: false, mensaje: "Su email y código no son aptos para activar la cuenta" })
            } else {
                return callback({ state: true, mensaje: "Cuenta activada" })
            }
        })
        .catch((error) => {
            return callback({ state: false, mensaje: "Error al activar la cuenta", error: error })
        })
}

// Función para eliminar un usuario
usuariosModel.eliminar = function (post, callback) {
    Usuarios.findByIdAndDelete(post._id)
        .then(() => {
            callback({ state: true, mensaje: "Elemento eliminado" });
        })
        .catch((error) => {
            callback({ state: false, mensaje: "Error al eliminar", error })
        })
}

// Función para guardar el código de recuperación de contraseña
usuariosModel.guardarCodigoRecuperacion = function (post, callback) {
    Usuarios.findOneAndUpdate(
        { email: post.email },
        { codepass: post.codigo }
    )
        .then(() => {
            callback({ state: true, mensaje: "Hemos enviado un correo electrónico, por favor verifica." })
        })
        .catch((error) => {
            callback({ state: false, mensaje: "Error al generar código", error })
        })
}

// Función para recuperar la contraseña
usuariosModel.recuperarPass = function (post, callback) {
    Usuarios.findOneAndUpdate(
        { email: post.email, codepass: post.codigo },
        { password: post.password }
    )
        .then((respuesta) => {
            if (!respuesta) {
                callback({ state: false, mensaje: "Código incorrecto o email no encontrado" })
            } else {
                callback({ state: true, mensaje: "Contraseña actualizada correctamente" })
            }
        })
        .catch((error) => {
            console.error("Error en recuperarpass:", error)
            callback({ state: false, mensaje: "Error al actualizar la contraseña", error })
        })
};


export default usuariosModel;

