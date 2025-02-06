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
    estado: { type: String, default: '1' },
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

    // Guarda la información
    instancia.save()
        .then((respuesta) => {
            console.log(respuesta);
            return callback({ state: true, mensaje: "Usuario guardado" });
        })
        .catch((error) => {
            console.error(error);
            return callback({ state: false, mensaje: "Se presentó un error" });
        });
};

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


export default usuariosModel;
